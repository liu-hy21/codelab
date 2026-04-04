import type { ChartRange, PrismTabKey } from "./types"

export const CHART_RANGE_OPTIONS: ReadonlyArray<{
  value: ChartRange
  label: string
}> = [
  { value: "1w", label: "一周内" },
  { value: "1y", label: "1 年内" },
  { value: "3y", label: "3 年内" },
]

export const CHART_RANGE_DESCRIPTION: Record<ChartRange, string> = {
  "1w": "一周内，日 K 收盘连线",
  "1y": "1 年内，日 K 抽样展示",
  "3y": "3 年内，日 K 抽样展示",
}

export const PRISM_TABS: ReadonlyArray<{ key: PrismTabKey; label: string }> = [
  { key: "trend", label: "走势看板" },
  { key: "metrics", label: "指标看板" },
  { key: "positions", label: "标的与仓位" },
  { key: "wisdom", label: "交易智慧" },
]

export const isChartRange = (v: string | null): v is ChartRange =>
  v === "1w" || v === "1y" || v === "3y"

export const isPrismTabKey = (v: string | null): v is PrismTabKey =>
  v === "trend" || v === "metrics" || v === "positions" || v === "wisdom"
