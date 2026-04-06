import type { ChartRange, PrismTabKey } from "./types"

export const CHART_RANGE_OPTIONS: ReadonlyArray<{
  value: ChartRange
  label: string
}> = [
  { value: "1W", label: "约一周" },
  { value: "1M", label: "近一月" },
  { value: "3M", label: "近三月" },
  { value: "6M", label: "近六月" },
  { value: "1Y", label: "近一年" },
  { value: "YTD", label: "年初至今" },
  { value: "3Y", label: "近三年" },
]

export const CHART_RANGE_DESCRIPTION: Record<ChartRange, string> = {
  "1W": "约一周，由本地缓存的近三年数据切片展示",
  "1M": "近一月，由本地缓存的近三年数据切片展示",
  "3M": "近三月，由本地缓存的近三年数据切片展示",
  "6M": "近六月，由本地缓存的近三年数据切片展示",
  "1Y": "近一年，由本地缓存的近三年数据切片展示",
  YTD: "年初至今，由本地缓存的近三年数据切片展示",
  "3Y": "近三年全量（每个自然日仅拉取一次并写入本地缓存）",
}

export const PRISM_TABS: ReadonlyArray<{ key: PrismTabKey; label: string }> = [
  { key: "trend", label: "走势看板" },
  { key: "metrics", label: "指标看板" },
  { key: "positions", label: "标的与仓位" },
  { key: "wisdom", label: "交易智慧" },
  { key: "targets", label: "标的配置" },
]

export const isChartRange = (v: string | null): v is ChartRange =>
  v === "1W" ||
  v === "1M" ||
  v === "3M" ||
  v === "6M" ||
  v === "1Y" ||
  v === "YTD" ||
  v === "3Y"

export const isPrismTabKey = (v: string | null): v is PrismTabKey =>
  v === "trend" ||
  v === "metrics" ||
  v === "positions" ||
  v === "wisdom" ||
  v === "targets"

/** 标的配置 · 所属市场（前端写死，与表单/筛选下拉一致） */
export const TRADE_TARGET_MARKETS = ["美股", "港股", "A股", "币"] as const

/** 筛选「全部市场」时下拉的 value（不写入请求体） */
export const TRADE_TARGET_MARKET_FILTER_ALL = "__all__" as const
