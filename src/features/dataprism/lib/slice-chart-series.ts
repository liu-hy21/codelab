import type {
  ChartPoint,
  ChartRange,
  InstrumentSeries,
  MarketCode,
} from "../types"

/** 非置顶尾部：美股 → 港股 → A 股 */
const TAIL_MARKET_ORDER: Record<MarketCode, number> = {
  US: 0,
  HK: 1,
  CN: 2,
}

/** 从标的配置 `code` 得到有序、去重后的列表（仅 trim） */
export const orderedCodesFromTargets = (codes: readonly string[]): string[] => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of codes) {
    const key = raw.trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
}

/**
 * 仅保留指定代码，顺序与 `orderedCodes` 一致；图表中不存在的不会出现。
 * 标的配置的 `code` 与走势里的 `instrument.id` 按 trim 后字符串相等匹配。
 */
export const filterSeriesByTargetCodes = (
  series: InstrumentSeries[],
  orderedCodes: readonly string[]
): InstrumentSeries[] => {
  const want = new Set(orderedCodes)
  const byId = new Map<string, InstrumentSeries>()
  for (const row of series) {
    const key = row.instrument.id.trim()
    if (want.has(key) && !byId.has(key)) {
      byId.set(key, row)
    }
  }
  return orderedCodes
    .map((code) => byId.get(code))
    .filter((row): row is InstrumentSeries => row !== undefined)
}

/**
 * 将 `instrument.symbol`（trim 后）与 `pinnedSymbols` 相等的项依次提到最前，其余保持原顺序。
 */
export const reorderSeriesWithPinnedSymbols = (
  series: InstrumentSeries[],
  pinnedSymbols: readonly string[]
): InstrumentSeries[] => {
  const pins = pinnedSymbols.map((s) => s.trim()).filter(Boolean)
  const head: InstrumentSeries[] = []
  const headIds = new Set<string>()
  for (const sym of pins) {
    const found = series.find(
      (row) => row.instrument.symbol.trim() === sym
    )
    if (found) {
      head.push(found)
      headIds.add(found.instrument.id)
    }
  }
  const tail = series.filter((row) => !headIds.has(row.instrument.id))
  return [...head, ...tail]
}

/**
 * 置顶块之后，按市场顺序 美股 → 港股 → A 股（同市场内保持原相对顺序）。
 */
export const sortTailByMarketUsHkCn = (
  series: InstrumentSeries[],
  pinnedSymbols: readonly string[]
): InstrumentSeries[] => {
  const pinSym = new Set(pinnedSymbols.map((s) => s.trim()))
  const firstTailIdx = series.findIndex(
    (s) => !pinSym.has(s.instrument.symbol.trim())
  )
  if (firstTailIdx === -1) return series
  const head = series.slice(0, firstTailIdx)
  const tail = series.slice(firstTailIdx)
  const tailSorted = [...tail].sort(
    (a, b) =>
      TAIL_MARKET_ORDER[a.instrument.market] -
      TAIL_MARKET_ORDER[b.instrument.market]
  )
  return [...head, ...tailSorted]
}

/** 拆成置顶行与后续（用于分区渲染与横线） */
export const splitPinnedHeadAndTail = (
  series: InstrumentSeries[],
  pinnedSymbols: readonly string[]
): { head: InstrumentSeries[]; tail: InstrumentSeries[] } => {
  const pinSym = new Set(pinnedSymbols.map((s) => s.trim()))
  const firstTailIdx = series.findIndex(
    (s) => !pinSym.has(s.instrument.symbol.trim())
  )
  if (firstTailIdx === -1) {
    return { head: series, tail: [] }
  }
  return {
    head: series.slice(0, firstTailIdx),
    tail: series.slice(firstTailIdx),
  }
}

/** 走势看板尾部按市场分块（顺序：美股、港股、A 股），空市场省略 */
export const tailBlocksByMarketUsHkCn = (
  tail: InstrumentSeries[]
): { market: MarketCode; label: string; items: InstrumentSeries[] }[] => {
  const defs: { market: MarketCode; label: string }[] = [
    { market: "US", label: "美股" },
    { market: "HK", label: "港股" },
    { market: "CN", label: "A 股" },
  ]
  return defs
    .map(({ market, label }) => ({
      market,
      label,
      items: tail.filter((s) => s.instrument.market === market),
    }))
    .filter((b) => b.items.length > 0)
}

const addCalendarDays = (isoDate: string, deltaDays: number): string => {
  const d = new Date(`${isoDate}T12:00:00`)
  d.setDate(d.getDate() + deltaDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * 在已按时间升序的近三年点列上，按当前展示周期切片（锚点为序列最后一个交易日）。
 */
export const slicePointsByRange = (
  points: ChartPoint[],
  range: ChartRange
): ChartPoint[] => {
  if (points.length === 0) return []
  const sorted = [...points].sort((a, b) => a.t.localeCompare(b.t))
  const lastT = sorted[sorted.length - 1].t

  if (range === "3Y") {
    return sorted
  }

  if (range === "YTD") {
    const y = Number(lastT.slice(0, 4))
    const start = `${y}-01-01`
    return sorted.filter((p) => p.t >= start)
  }

  const lookbackDays: Partial<Record<ChartRange, number>> = {
    "1W": 7,
    "1M": 31,
    "3M": 92,
    "6M": 184,
    "1Y": 366,
  }
  const days = lookbackDays[range]
  if (days === undefined) {
    return sorted
  }
  const startDate = addCalendarDays(lastT, -days)
  return sorted.filter((p) => p.t >= startDate)
}

export const sliceSeriesByRange = (
  series: InstrumentSeries[],
  range: ChartRange
): InstrumentSeries[] =>
  series.map((row) => ({
    ...row,
    points: slicePointsByRange(row.points, range),
  }))
