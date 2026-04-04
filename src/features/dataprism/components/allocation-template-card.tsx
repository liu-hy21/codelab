"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const AllocationTemplateCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">资金分配（目标模板）</CardTitle>
        <CardDescription>
          当前为策略模板展示，接入持仓后可对比实际占比。
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
        <ul className="list-inside list-disc space-y-1" role="list">
          <li>短线 20% · 长线 80%</li>
          <li>
            品种侧：A 股 AI 相关 ETF 约 20% · 港股约 30% · 美股约 50%（内含标普/纳指与个股等，以实际配置为准）
          </li>
        </ul>
        <p className="text-pretty">
          暂无持仓快照时，仅展示上述目标结构，不推断实际仓位。
        </p>
      </CardContent>
    </Card>
  )
}
