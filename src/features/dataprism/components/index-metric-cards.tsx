"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { IndexMetricSnapshot } from "../types"

const pctFmt = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
})

const pctFmtUnsigned = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

type IndexMetricCardsProps = {
  metrics: IndexMetricSnapshot[]
}

export const IndexMetricCards = ({ metrics }: IndexMetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {metrics.map((m) => {
        const progressTowardSahara = Math.min(
          100,
          (m.drawdownFromPeakPct / m.saharaThresholdPct) * 100
        )
        const room = m.saharaThresholdPct - m.drawdownFromPeakPct
        const triggered = m.drawdownFromPeakPct >= m.saharaThresholdPct

        return (
          <Card key={m.id} className="min-w-0">
            <CardHeader className="space-y-1 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{m.label}</CardTitle>
                <span className="text-muted-foreground font-mono text-sm tabular-nums">
                  {m.symbol}
                </span>
                {triggered ? (
                  <Badge variant="destructive">已达梭哈回撤条件（演示）</Badge>
                ) : null}
              </div>
              <CardDescription>{m.anchorHighNote}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">当日涨跌</dt>
                  <dd
                    className={
                      m.dailyChangePct >= 0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-destructive tabular-nums"
                    }
                  >
                    <span className="text-2xl font-semibold tabular-nums tracking-tight">
                      {pctFmt.format(m.dailyChangePct)}
                    </span>
                    <span className="text-muted-foreground ml-1">%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">自阶段高点回撤</dt>
                  <dd className="text-foreground text-2xl font-semibold tabular-nums tracking-tight">
                    {pctFmtUnsigned.format(m.drawdownFromPeakPct)}
                    <span className="text-muted-foreground ml-1 text-base font-normal">
                      %
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">
                    距写死梭哈阈值（{m.saharaThresholdPct}%）进度
                  </span>
                  <span className="text-foreground tabular-nums">
                    {triggered
                      ? "已触及或超过阈值（演示）"
                      : `剩余约 ${pctFmtUnsigned.format(Math.max(0, room))} 个百分点`}
                  </span>
                </div>
                <Progress
                  value={progressTowardSahara}
                  aria-label={`${m.label} 回撤已接近梭哈阈值 ${pctFmtUnsigned.format(progressTowardSahara)}%`}
                />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  规则写死：标普最大累计跌幅 ≥ 20%、纳指 ≥ 25% 时触发梭哈类信号（以服务端为准）。
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
