"use client"

import { useId } from "react"
import { Card } from "@/components/ui/card"
import { usePositionsBoardData } from "../hooks/use-positions-board-data"
import { PositionsBoardTable } from "./positions-board-table"

export const PositionsBoardPanel = () => {
  const { loading, rows } = usePositionsBoardData()
  const headingId = useId()

  return (
    <section className="space-y-8" aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        标的与仓位：监控池与持仓快照
      </h2>

      <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed text-pretty">
        以下为演示持仓快照，与交易流水无关；接入真实账户后由服务端同步数量与市值。长线关注仅作标签展示，不推断买卖频次。
      </p>

      {loading && rows.length === 0 ? (
        <div className="space-y-4" aria-hidden="true">
          <Card className="bg-muted/40 h-14 animate-pulse border-0" />
          <Card className="bg-muted/40 h-64 animate-pulse border-0" />
        </div>
      ) : (
        <PositionsBoardTable rows={rows} loading={loading} />
      )}
    </section>
  )
}
