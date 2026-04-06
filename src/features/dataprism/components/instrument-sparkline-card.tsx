"use client"

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrefersReducedMotion } from "../hooks/use-prefers-reduced-motion"
import type { ChartPoint, ChartRange, InstrumentMeta } from "../types"
import { CHART_RANGE_DESCRIPTION } from "../constants"

const marketLabel: Record<InstrumentMeta["market"], string> = {
  CN: "A 股",
  HK: "港股",
  US: "美股",
}

const dateFmt = new Intl.DateTimeFormat("zh-CN", {
  month: "short",
  day: "numeric",
})

const priceFmt = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type InstrumentSparklineCardProps = {
  instrument: InstrumentMeta
  points: ChartPoint[]
  range: ChartRange
}

export const InstrumentSparklineCard = ({
  instrument,
  points,
  range,
}: InstrumentSparklineCardProps) => {
  const reduceMotion = usePrefersReducedMotion()
  const summary = `${instrument.symbol}，${CHART_RANGE_DESCRIPTION[range]}，纵轴为收盘价，共 ${points.length} 个数据点`

  return (
    <Card className="flex min-w-0 flex-col overflow-hidden">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <CardTitle className="truncate text-base font-semibold tabular-nums">
            {instrument.symbol}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {marketLabel[instrument.market]}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
          {instrument.name}
        </p>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        {points.length === 0 ? (
          <div
            className="text-muted-foreground flex h-40 items-center justify-center rounded-md border border-dashed text-sm"
            role="status"
          >
            暂无 K 线
          </div>
        ) : (
          <div
            className="text-muted-foreground h-40 w-full min-w-0 [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground"
            role="img"
            aria-label={summary}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={points}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="t"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => dateFmt.format(new Date(`${v}T12:00:00`))}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={["auto", "auto"]}
                  width={44}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                  tickFormatter={(v) => priceFmt.format(Number(v))}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    fontSize: "0.75rem",
                  }}
                  labelFormatter={(label) =>
                    new Intl.DateTimeFormat("zh-CN", {
                      dateStyle: "medium",
                    }).format(new Date(`${label}T12:00:00`))
                  }
                  formatter={(val) => [
                    priceFmt.format(Number(val)),
                    "收盘",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={!reduceMotion}
                  animationDuration={reduceMotion ? 0 : 400}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="text-muted-foreground mt-2 text-xs" aria-hidden="true">
          纵轴：收盘价
        </p>
      </CardContent>
    </Card>
  )
}
