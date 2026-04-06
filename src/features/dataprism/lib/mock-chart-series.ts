import type { ChartPoint, ChartRange, InstrumentMeta, InstrumentSeries } from "../types"

const MOCK_INSTRUMENTS: InstrumentMeta[] = [
  { id: "spy", symbol: "SPY", name: "标普 500 ETF", market: "US" },
  { id: "qqq", symbol: "QQQ", name: "纳指 100 ETF", market: "US" },
  { id: "bnd", symbol: "BND", name: "全债市 ETF", market: "US" },
  { id: "orcl", symbol: "ORCL", name: "甲骨文", market: "US" },
  { id: "msft", symbol: "MSFT", name: "微软", market: "US" },
  { id: "mu", symbol: "MU", name: "美光", market: "US" },
  { id: "9988", symbol: "09988", name: "阿里巴巴", market: "HK" },
  { id: "700", symbol: "00700", name: "腾讯控股", market: "HK" },
  { id: "3033", symbol: "03033", name: "恒指科技 ETF", market: "HK" },
  { id: "512480", symbol: "512480", name: "半导体 ETF", market: "CN" },
  { id: "515790", symbol: "515790", name: "光伏 ETF", market: "CN" },
  { id: "518880", symbol: "518880", name: "黄金 ETF", market: "CN" },
]

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tradingDayCount(range: ChartRange): number {
  switch (range) {
    case "1W":
      return 7
    case "1M":
      return 22
    case "3M":
      return 66
    case "6M":
      return 130
    case "1Y":
      return 120
    case "YTD":
      return 90
    case "3Y":
      return 200
    default:
      return 22
  }
}

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

function generatePointsForInstrument(
  instrument: InstrumentMeta,
  range: ChartRange
): ChartPoint[] {
  const n = tradingDayCount(range)
  const rand = mulberry32(
    instrument.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + n * 17
  )
  let price =
    instrument.market === "US"
      ? 100 + rand() * 400
      : instrument.market === "HK"
        ? 50 + rand() * 200
        : 1 + rand() * 3

  const end = new Date()
  const points: ChartPoint[] = []
  for (let i = n - 1; i >= 0; i -= 1) {
    const day = addDays(end.toISOString().slice(0, 10), -i)
    price *= 1 + (rand() - 0.48) * 0.028
    points.push({ t: day, close: Math.round(price * 100) / 100 })
  }
  return points
}

export const listMockInstruments = (): InstrumentMeta[] => [...MOCK_INSTRUMENTS]

export const buildMockInstrumentSeries = (range: ChartRange): InstrumentSeries[] =>
  MOCK_INSTRUMENTS.map((instrument) => ({
    instrument,
    points: generatePointsForInstrument(instrument, range),
  }))
