"use client"

import { useMemo, useState } from "react"
import { AlertCircleIcon, CircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { MarketCode, WatchlistMetricRow } from "../types"

const PAGE_SIZE = 8

const marketLabel: Record<MarketCode, string> = {
  CN: "A 股",
  HK: "港股",
  US: "美股",
}

const pctFmt = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
})

type MetricsWatchlistTableProps = {
  rows: WatchlistMetricRow[]
  loading: boolean
}

export const MetricsWatchlistTable = ({
  rows,
  loading,
}: MetricsWatchlistTableProps) => {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.symbol.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [rows, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, safePage])

  const searchId = "metrics-watchlist-search"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-md flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium">
            搜索标的或标签
          </label>
          <Input
            id={searchId}
            name="metrics-watchlist-query"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="代码、名称或标签…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <p className="text-muted-foreground text-sm tabular-nums">
          共 {filtered.length} 条
          {filtered.length > PAGE_SIZE
            ? ` · 第 ${safePage} / ${totalPages} 页`
            : null}
        </p>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标的</TableHead>
              <TableHead>市场</TableHead>
              <TableHead>标签</TableHead>
              <TableHead className="text-right tabular-nums">日涨跌</TableHead>
              <TableHead className="text-right">今日信号</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <span className="text-muted-foreground text-sm">
                    加载中…
                  </span>
                </TableCell>
              </TableRow>
            ) : slice.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground h-32 text-center text-sm"
                >
                  {filtered.length === 0 && rows.length > 0
                    ? "无匹配结果"
                    : "暂无数据"}
                </TableCell>
              </TableRow>
            ) : (
              slice.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="min-w-0 font-medium">
                    <div className="flex flex-col">
                      <span className="font-mono tabular-nums">{r.symbol}</span>
                      <span className="text-muted-foreground line-clamp-1 text-xs font-normal">
                        {r.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{marketLabel[r.market]}</TableCell>
                  <TableCell className="max-w-[12rem]">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell
                    className={
                      r.dailyChangePct >= 0
                        ? "text-right tabular-nums text-emerald-700 dark:text-emerald-400"
                        : "text-destructive text-right tabular-nums"
                    }
                  >
                    {pctFmt.format(r.dailyChangePct)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {r.signalToday ? (
                      <span className="inline-flex items-center justify-end gap-1 text-amber-700 dark:text-amber-400">
                        <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="text-sm">已触发</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground inline-flex items-center justify-end gap-1">
                        <CircleIcon className="size-4 shrink-0 opacity-60" aria-hidden="true" />
                        <span className="text-sm">未触发</span>
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && filtered.length > PAGE_SIZE ? (
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">每页 {PAGE_SIZE} 条</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一页
            </Button>
            <span className="text-muted-foreground tabular-nums">
              {safePage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              下一页
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
