/** 与后端 CommonResponse 对齐（数据棱镜交易智慧等模块） */
export interface CommonResponse<T> {
  success: boolean
  code: number
  msg: string
  data: T
}

/** 交易智慧 · TradeWisdomVO */
export type TradeWisdomVO = {
  id: number
  content: string
  author: string
  tag: string
}

export type TradeWisdomAddRequest = {
  content: string
  author?: string
  tag?: string
}

export type TradeWisdomUpdateRequest = TradeWisdomAddRequest & {
  id: number
}

export type ChartRange = "1w" | "1y" | "3y"

export type PrismTabKey = "trend" | "metrics" | "positions" | "wisdom"

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

/** 指标看板：标普 / 纳指摘要（演示数据） */
export type IndexMetricSnapshot = {
  id: string
  label: string
  symbol: string
  dailyChangePct: number
  drawdownFromPeakPct: number
  /** 写死梭哈阈值：标普 20%、纳指 25% */
  saharaThresholdPct: number
  anchorHighNote: string
}

/** 监控列表行（演示数据） */
export type WatchlistMetricRow = {
  id: string
  symbol: string
  name: string
  market: MarketCode
  tags: string[]
  dailyChangePct: number
  signalToday: boolean
}

/** 标的与仓位表格行（演示数据，无成交流水） */
export type PositionInstrumentRow = {
  id: string
  symbol: string
  name: string
  market: MarketCode
  tags: string[]
  /** 无持仓时为 null */
  quantity: number | null
  marketValue: number | null
  avgCost: number | null
  unrealizedPnlPct: number | null
  longTermWatch: boolean
}
