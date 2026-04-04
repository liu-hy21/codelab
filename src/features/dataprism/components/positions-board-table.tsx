"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  formatCostPerShare,
  formatPositionMoney,
  formatPositionQuantity,
  formatUnrealizedPnlPct,
} from "../lib/format-position-numbers"
import type { MarketCode, PositionInstrumentRow } from "../types"

const PAGE_SIZE = 8

const marketLabel: Record<MarketCode, string> = {
  CN: "A 股",
  HK: "港股",
  US: "美股",
}

type MarketFilter = "all" | MarketCode

type PositionsBoardTableProps = {
  rows: PositionInstrumentRow[]
  loading: boolean
}

export const PositionsBoardTable = ({
  rows,
  loading,
}: PositionsBoardTableProps) => {
  const [query, setQuery] = useState("")
  const [marketFilter, setMarketFilter] = useState<MarketFilter>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [page, setPage] = useState(1)

  const tagOptions = useMemo(() => {
    const set = new Set<string>()
    for (const r of rows) {
      for (const t of r.tags) set.add(t)
    }
    return [...set].sort((a, b) => a.localeCompare(b, "zh-CN"))
  }, [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      const marketOk =
        marketFilter === "all" || r.market === marketFilter
      const tagOk =
        tagFilter === "all" || r.tags.includes(tagFilter)
      const searchOk =
        !q ||
        r.symbol.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      return marketOk && tagOk && searchOk
    })
  }, [rows, query, marketFilter, tagFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, safePage])

  const searchId = "positions-board-search"
  const marketSelectId = "positions-board-market"
  const tagSelectId = "positions-board-tag"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
        <div className="flex min-w-0 max-w-md flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium">
            搜索标的或标签
          </label>
          <Input
            id={searchId}
            name="positions-board-query"
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
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <div className="flex flex-col gap-2">
            <span id={`${marketSelectId}-label`} className="text-sm font-medium">
              市场
            </span>
            <Select
              value={marketFilter}
              onValueChange={(v) => {
                setMarketFilter(v as MarketFilter)
                setPage(1)
              }}
            >
              <SelectTrigger
                id={marketSelectId}
                className="w-full min-w-[140px] touch-manipulation sm:w-[160px]"
                aria-labelledby={`${marketSelectId}-label`}
              >
                <SelectValue placeholder="选择市场…" />
              </SelectTrigger>
              <SelectContent className="overscroll-y-contain">
                <SelectItem value="all">全部市场</SelectItem>
                <SelectItem value="CN">{marketLabel.CN}</SelectItem>
                <SelectItem value="HK">{marketLabel.HK}</SelectItem>
                <SelectItem value="US">{marketLabel.US}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span id={`${tagSelectId}-label`} className="text-sm font-medium">
              标签
            </span>
            <Select
              value={tagFilter}
              onValueChange={(v) => {
                setTagFilter(v)
                setPage(1)
              }}
            >
              <SelectTrigger
                id={tagSelectId}
                className="w-full min-w-[140px] touch-manipulation sm:w-[180px]"
                aria-labelledby={`${tagSelectId}-label`}
              >
                <SelectValue placeholder="选择标签…" />
              </SelectTrigger>
              <SelectContent className="overscroll-y-contain">
                <SelectItem value="all">全部标签</SelectItem>
                {tagOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-muted-foreground text-sm tabular-nums lg:ml-auto">
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
              <TableHead>主题标签</TableHead>
              <TableHead>长线关注</TableHead>
              <TableHead className="text-right tabular-nums">持仓数量</TableHead>
              <TableHead className="text-right">持仓市值</TableHead>
              <TableHead className="text-right">成本（单价）</TableHead>
              <TableHead className="text-right">浮动盈亏</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <span className="text-muted-foreground text-sm">
                    加载中…
                  </span>
                </TableCell>
              </TableRow>
            ) : slice.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
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
                  <TableCell className="max-w-[14rem]">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {r.longTermWatch ? (
                      <Badge variant="outline" className="font-normal">
                        长线关注
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.quantity !== null
                      ? formatPositionQuantity(r.quantity)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.marketValue !== null
                      ? formatPositionMoney(r.market, r.marketValue)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.avgCost !== null
                      ? formatCostPerShare(r.market, r.avgCost)
                      : "—"}
                  </TableCell>
                  <TableCell
                    className={
                      r.unrealizedPnlPct === null
                        ? "text-muted-foreground text-right text-sm"
                        : r.unrealizedPnlPct >= 0
                          ? "text-right tabular-nums text-emerald-700 dark:text-emerald-400"
                          : "text-destructive text-right tabular-nums"
                    }
                  >
                    {r.unrealizedPnlPct !== null
                      ? formatUnrealizedPnlPct(r.unrealizedPnlPct)
                      : "—"}
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
