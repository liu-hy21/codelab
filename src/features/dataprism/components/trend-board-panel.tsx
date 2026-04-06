"use client"

import { useId, useMemo } from "react"
import { Loader2Icon } from "lucide-react"
import { CHART_RANGE_DESCRIPTION, PRISM_TREND_PINNED_SYMBOLS } from "../constants"
import { usePrismChartData } from "../hooks/use-prism-chart-data"
import {
  splitPinnedHeadAndTail,
  tailBlocksByMarketUsHkCn,
} from "../lib/slice-chart-series"
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
  const { loading, series, error, targetCodeCount } = usePrismChartData(range)
  const headingId = useId()
  const rangeSelectId = useId()

  const { headSeries, tailBlocks } = useMemo(() => {
    const { head, tail } = splitPinnedHeadAndTail(
      series,
      PRISM_TREND_PINNED_SYMBOLS
    )
    return {
      headSeries: head,
      tailBlocks: tailBlocksByMarketUsHkCn(tail),
    }
  }, [series])

  const gridClassName =
    "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"

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
        <div className="text-muted-foreground max-w-prose space-y-1 text-sm text-pretty">
          <p>{CHART_RANGE_DESCRIPTION[range]}</p>
          <p className="text-xs">
            展示标的与顺序来自「标的配置」全量列表的{" "}
            <span className="font-mono">code</span>
            ，与走势接口里品种的 <span className="font-mono">instrument.id</span>{" "}
            写法一致（首尾空白会忽略）。每个自然日仅拉取一次近三年数据至本地缓存，切换周期不重复请求。
          </p>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? "走势图加载中…"
          : error
            ? `加载失败：${error}`
            : `已加载 ${series.length} 个品种`}
      </p>

      {error ? (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/5 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div
          className="text-muted-foreground flex min-h-[240px] items-center justify-center gap-2 rounded-lg border border-dashed"
          role="status"
        >
          <Loader2Icon className="size-5 animate-spin" aria-hidden="true" />
          <span>加载走势图…</span>
        </div>
      ) : !error && series.length === 0 ? (
        <div
          className="text-muted-foreground flex min-h-[240px] items-center justify-center rounded-lg border border-dashed px-4 text-center text-sm"
          role="status"
        >
          {targetCodeCount === 0
            ? "标的配置中暂无有效 code，请先在「标的配置」页签添加标的。"
            : "走势数据中未匹配到已配置的 code，请确认与接口返回的 instrument.id 一致。"}
        </div>
      ) : !error ? (
        <div className="space-y-0">
          {headSeries.length > 0 ? (
            <ul className={gridClassName}>
              {headSeries.map(({ instrument, points }) => (
                <li key={instrument.id} className="min-w-0">
                  <InstrumentSparklineCard
                    instrument={instrument}
                    points={points}
                    range={range}
                  />
                </li>
              ))}
            </ul>
          ) : null}
          {tailBlocks.map((block, blockIndex) => (
            <div key={block.market} className="space-y-0">
              {(headSeries.length > 0 || blockIndex > 0) ? (
                <hr
                  className="border-border my-6"
                  role="separator"
                  aria-orientation="horizontal"
                />
              ) : null}
              <ul className={gridClassName}>
                {block.items.map(({ instrument, points }) => (
                  <li key={instrument.id} className="min-w-0">
                    <InstrumentSparklineCard
                      instrument={instrument}
                      points={points}
                      range={range}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
