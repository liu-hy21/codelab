"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2Icon } from "lucide-react"
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
import { addTradeTarget, updateTradeTarget } from "../api/trade-target"
import {
  TRADE_TARGET_MARKET_FILTER_ALL,
  TRADE_TARGET_MARKETS,
} from "../constants"
import { useTradeTargetQuery } from "../hooks/use-trade-target-query"
import type { TradeTargetMutateValues } from "../schema/trade-target"
import type { TradeTargetQueryRequest, TradeTargetVO } from "../types"
import { TradeTargetFormDialog } from "./trade-target-form-dialog"

const PAGE_SIZE = 8
const FILTER_DEBOUNCE_MS = 320

const buildQueryBody = (
  code: string,
  cnName: string,
  market: string
): TradeTargetQueryRequest => {
  const body: TradeTargetQueryRequest = {}
  const c = code.trim()
  const n = cnName.trim()
  const m = market.trim()
  if (c) body.code = c
  if (n) body.cnName = n
  if (m) body.market = m
  return body
}

export const TradeTargetPanel = () => {
  const { list, loading, error, query } = useTradeTargetQuery()
  const [code, setCode] = useState("")
  const [cnName, setCnName] = useState("")
  const [market, setMarket] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<TradeTargetVO | null>(null)

  const appliedFilters = useMemo(
    () => buildQueryBody(code, cnName, market),
    [code, cnName, market]
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1)
      void query(appliedFilters)
    }, FILTER_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [appliedFilters, query])

  const refetch = useCallback(() => {
    void query(appliedFilters)
  }, [appliedFilters, query])

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return list.slice(start, start + PAGE_SIZE)
  }, [list, safePage])

  const idCode = "trade-target-filter-code"
  const idCnName = "trade-target-filter-cnname"
  const idMarket = "trade-target-filter-market"

  const openCreate = () => {
    setFormMode("create")
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (row: TradeTargetVO) => {
    setFormMode("edit")
    setEditing(row)
    setFormOpen(true)
  }

  const handleMutate = async (values: TradeTargetMutateValues) => {
    const codeTrim = values.code.trim()
    const cnNameTrim = values.cnName.trim()
    const marketTrim = values.market.trim()
    if (values.id !== undefined && values.id > 0) {
      await updateTradeTarget({
        id: values.id,
        code: codeTrim,
        cnName: cnNameTrim,
        market: marketTrim,
      })
    } else {
      await addTradeTarget({
        code: codeTrim,
        cnName: cnNameTrim,
        market: marketTrim,
      })
    }
    await refetch()
  }

  return (
    <section className="space-y-6" aria-labelledby="trade-target-heading">
      <div className="space-y-1">
        <h2
          id="trade-target-heading"
          className="text-lg font-semibold tracking-tight"
        >
          标的配置
        </h2>
      </div>

      {error ? (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/5 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          {error}
        </div>
      ) : null}

      <div
        className="border-border flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end sm:justify-between"
        role="search"
        aria-label="标的筛选"
      >
        <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={idCode} className="text-sm font-medium">
              标的代码
              <span className="text-muted-foreground ml-1 font-normal">
                （模糊）
              </span>
            </label>
            <Input
              id={idCode}
              name="trade-target-code"
              type="search"
              autoComplete="off"
              spellCheck={false}
              placeholder="如：600"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor={idCnName} className="text-sm font-medium">
              中文名
              <span className="text-muted-foreground ml-1 font-normal">
                （模糊）
              </span>
            </label>
            <Input
              id={idCnName}
              name="trade-target-cnname"
              type="search"
              autoComplete="off"
              placeholder="如：茅台"
              value={cnName}
              onChange={(e) => setCnName(e.target.value)}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:col-span-2 lg:col-span-1">
            <span id={`${idMarket}-label`} className="text-sm font-medium">
              所属市场
              <span className="text-muted-foreground ml-1 font-normal">
                （精确）
              </span>
            </span>
            <Select
              value={market === "" ? TRADE_TARGET_MARKET_FILTER_ALL : market}
              onValueChange={(v) =>
                setMarket(v === TRADE_TARGET_MARKET_FILTER_ALL ? "" : v)
              }
            >
              <SelectTrigger
                id={idMarket}
                name="trade-target-market"
                className="w-full"
                aria-labelledby={`${idMarket}-label`}
              >
                <SelectValue placeholder="全部市场" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TRADE_TARGET_MARKET_FILTER_ALL}>
                  全部市场
                </SelectItem>
                {TRADE_TARGET_MARKETS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="button"
          className="bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90"
          onClick={openCreate}
        >
          新建标的
        </Button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {loading ? "标的列表加载中…" : `共 ${list.length} 条标的`}
      </p>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[8rem]">标的代码</TableHead>
              <TableHead className="min-w-[10rem]">中文名</TableHead>
              <TableHead className="w-32">所属市场</TableHead>
              <TableHead className="text-right w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                    <Loader2Icon
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    加载中…
                  </span>
                </TableCell>
              </TableRow>
            ) : slice.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground h-32 text-center text-sm"
                >
                  {list.length === 0
                    ? "暂无标的，请调整筛选或点击「新建标的」添加。"
                    : "当前页无数据"}
                </TableCell>
              </TableRow>
            ) : (
              slice.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-mono text-sm">{row.code}</TableCell>
                  <TableCell>{row.cnName}</TableCell>
                  <TableCell>
                    <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">
                      {row.market}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(row)}
                    >
                      编辑
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && list.length > PAGE_SIZE ? (
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

      <TradeTargetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onSubmit={handleMutate}
      />
    </section>
  )
}
