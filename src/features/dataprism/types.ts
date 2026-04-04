export type ChartRange = "1w" | "1y" | "3y"

export type PrismTabKey = "trend" | "metrics" | "positions"

export type MarketCode = "CN" | "HK" | "US"

export type ChartPoint = {
  t: string
  close: number
}

export type InstrumentMeta = {
  id: string
  symbol: string
  name: string
  market: MarketCode
}

export type InstrumentSeries = {
  instrument: InstrumentMeta
  points: ChartPoint[]
}
