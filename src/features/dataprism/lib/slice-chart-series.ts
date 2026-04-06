import type { ChartPoint, ChartRange, InstrumentSeries } from "../types"

/** 去掉交易所后缀，便于标的配置的 `code` 与走势 `symbol` 对齐 */
export const normalizeInstrumentSymbol = (symbol: string): string =>
  symbol
    .trim()
    .replace(/\.(SS|SZ|SH|BJ)$/i, "")

/** 从标的配置 `code` 得到有序、去重后的键（与 `normalizeInstrumentSymbol` 规则一致） */
export const orderedCodesFromTargets = (codes: readonly string[]): string[] => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of codes) {
    const key = normalizeInstrumentSymbol(raw)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
}

/**
 * 仅保留指定代码，顺序与 `orderedSymbols` 一致；图表中不存在的代码不会出现。
 */
export const filterSeriesByDisplaySymbols = (
  series: InstrumentSeries[],
  orderedSymbols: readonly string[]
): InstrumentSeries[] => {
  const want = new Set(orderedSymbols)
  const bySymbol = new Map<string, InstrumentSeries>()
  for (const row of series) {
    const key = normalizeInstrumentSymbol(row.instrument.symbol)
    if (want.has(key) && !bySymbol.has(key)) {
      bySymbol.set(key, row)
    }
  }
  return orderedSymbols
    .map((sym) => bySymbol.get(sym))
    .filter((row): row is InstrumentSeries => row !== undefined)
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
