import type { IndexMetricSnapshot, WatchlistMetricRow } from "../types"
import { listMockInstruments } from "./mock-chart-series"

const TAG_POOLS: Record<string, string[]> = {
  US: ["美股大盘", "科技", "半导体", "存储"],
  HK: ["港股科技", "恒科", "互联网"],
  CN: ["A 股 ETF", "芯片", "光伏", "黄金", "电力"],
}

export const pickInstrumentTags = (
  market: "CN" | "HK" | "US",
  seed: number
): string[] => {
  const pool = TAG_POOLS[market]
  const a = pool[seed % pool.length]!
  const b = pool[(seed + 3) % pool.length]!
  return a === b ? [a] : [a, b]
}

export const getMockIndexMetrics = (): IndexMetricSnapshot[] => [
  {
    id: "spy-m",
    label: "标普 500",
    symbol: "SPY",
    dailyChangePct: -0.38,
    drawdownFromPeakPct: 8.2,
    saharaThresholdPct: 20,
    anchorHighNote: "阶段高点参考：滚动 252 交易日（演示）",
  },
  {
    id: "qqq-m",
    label: "纳斯达克 100",
    symbol: "QQQ",
    dailyChangePct: -1.85,
    drawdownFromPeakPct: 14.6,
    saharaThresholdPct: 25,
    anchorHighNote: "阶段高点参考：滚动 252 交易日（演示）",
  },
]

export const getMockWatchlistMetricRows = (): WatchlistMetricRow[] => {
  const list = listMockInstruments()
  return list.map((ins, i) => ({
    id: ins.id,
    symbol: ins.symbol,
    name: ins.name,
    market: ins.market,
    tags: pickInstrumentTags(ins.market, i + ins.symbol.length),
    dailyChangePct: Math.round((Math.sin(i * 1.7) * 4.2 - 0.5) * 100) / 100,
    signalToday: i % 5 === 1 || i % 7 === 3,
  }))
}
