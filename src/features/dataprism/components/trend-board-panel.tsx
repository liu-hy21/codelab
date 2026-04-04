"use client"

import { useId } from "react"
import { Loader2Icon } from "lucide-react"
import { CHART_RANGE_DESCRIPTION } from "../constants"
import { usePrismChartData } from "../hooks/use-prism-chart-data"
import type { ChartRange } from "../types"
import { ChartRangeSelect } from "./chart-range-select"
import { InstrumentSparklineCard } from "./instrument-sparkline-card"

type TrendBoardPanelProps = {
  range: ChartRange
  onRangeChange: (range: ChartRange) => void
}

export const TrendBoardPanel = ({
  range,
  onRangeChange,
}: TrendBoardPanelProps) => {
  const { loading, series } = usePrismChartData(range)
  const headingId = useId()
  const rangeSelectId = useId()

  return (
    <section
      role="region"
      aria-labelledby={headingId}
      className="space-y-6"
    >
      <h2 id={headingId} className="sr-only">
        走势看板，全品种收盘价走势图
      </h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <label
            htmlFor={rangeSelectId}
            className="text-sm font-medium text-foreground"
          >
            时间范围
          </label>
          <ChartRangeSelect
            id={rangeSelectId}
            value={range}
            onChange={onRangeChange}
          />
        </div>
        <p className="text-muted-foreground max-w-prose text-sm text-pretty">
          {CHART_RANGE_DESCRIPTION[range]}
        </p>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {loading ? "走势图加载中…" : `已加载 ${series.length} 个品种`}
      </p>

      {loading ? (
        <div
          className="text-muted-foreground flex min-h-[240px] items-center justify-center gap-2 rounded-lg border border-dashed"
          role="status"
        >
          <Loader2Icon className="size-5 animate-spin" aria-hidden="true" />
          <span>加载走势图…</span>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {series.map(({ instrument, points }) => (
            <li key={instrument.id} className="min-w-0">
              <InstrumentSparklineCard
                instrument={instrument}
                points={points}
                range={range}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
