"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { useMetricsBoardData } from "../hooks/use-metrics-board-data"
import { AllocationTemplateCard } from "./allocation-template-card"
import { IndexMetricCards } from "./index-metric-cards"
import { MetricsWatchlistTable } from "./metrics-watchlist-table"

export const MetricsBoardPanel = () => {
  const { loading, indexMetrics, watchlist } = useMetricsBoardData()
  const headingId = useId()
  const watchlistHeadingId = useId()

  return (
    <section
      className="space-y-8"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">
        指标看板：指数回撤与监控列表
      </h2>

      <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed text-pretty">
        以下为演示数据。各市场交易日历与收盘时刻不同，对比日涨跌时请结合数据源时区；美东与沪深港股不可简单同日横向对比。
      </p>

      {loading && indexMetrics.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-hidden="true">
          <Card className="bg-muted/40 h-52 animate-pulse border-0" />
          <Card className="bg-muted/40 h-52 animate-pulse border-0" />
        </div>
      ) : (
        <IndexMetricCards metrics={indexMetrics} />
      )}

      <AllocationTemplateCard />

      <div className="space-y-4">
        <h3
          id={watchlistHeadingId}
          className="text-foreground text-lg font-semibold tracking-tight"
        >
          监控列表
        </h3>
        <MetricsWatchlistTable rows={watchlist} loading={loading} />
      </div>
    </section>
  )
}
