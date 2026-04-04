"use client"

import { useMemo, useState } from "react"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { addTradeWisdom, updateTradeWisdom } from "../api/trade-wisdom"
import { useTradeWisdomList } from "../hooks/use-trade-wisdom-list"
import type { TradeWisdomMutateValues } from "../schema/trade-wisdom"
import type { TradeWisdomVO } from "../types"
import { TradeWisdomFormDialog } from "./trade-wisdom-form-dialog"

const PAGE_SIZE = 8
/** 列表「内容」列超过该字数时显示省略号 */
const CONTENT_PREVIEW_MAX = 20

const formatContentPreview = (text: string): string =>
  text.length <= CONTENT_PREVIEW_MAX
    ? text
    : `${text.slice(0, CONTENT_PREVIEW_MAX)}...`

export const TradeWisdomPanel = () => {
  const { list, loading, error, refetch } = useTradeWisdomList()
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<TradeWisdomVO | null>(null)
  const [detailRow, setDetailRow] = useState<TradeWisdomVO | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (row) =>
        row.content.toLowerCase().includes(q) ||
        (row.author && row.author.toLowerCase().includes(q)) ||
        (row.tag && row.tag.toLowerCase().includes(q))
    )
  }, [list, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const slice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, safePage])

  const searchId = "trade-wisdom-search"

  const openCreate = () => {
    setFormMode("create")
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (row: TradeWisdomVO) => {
    setFormMode("edit")
    setEditing(row)
    setFormOpen(true)
  }

  const openDetail = (row: TradeWisdomVO) => {
    setDetailRow(row)
  }

  const handleMutate = async (values: TradeWisdomMutateValues) => {
    const author = values.author?.trim()
    const tag = values.tag?.trim()
    const base = {
      content: values.content.trim(),
      ...(author ? { author } : {}),
      ...(tag ? { tag } : {}),
    }
    if (values.id !== undefined && values.id > 0) {
      await updateTradeWisdom({ id: values.id, ...base })
    } else {
      await addTradeWisdom(base)
    }
    await refetch()
  }

  return (
    <section className="space-y-6" aria-labelledby="trade-wisdom-heading">

      {error ? (
        <div
          role="alert"
          className="border-destructive/50 bg-destructive/5 text-destructive rounded-lg border px-4 py-3 text-sm"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex max-w-md min-w-0 flex-1 flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium">
            搜索内容、作者或标签
          </label>
          <Input
            id={searchId}
            name="trade-wisdom-query"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="输入关键词…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Button type="button" onClick={openCreate}>
          新建语录
        </Button>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {loading
          ? "语录列表加载中…"
          : `共 ${filtered.length} 条语录`}
      </p>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[12rem]">内容</TableHead>
              <TableHead className="w-28">作者</TableHead>
              <TableHead className="w-28">标签</TableHead>
              <TableHead className="text-right min-w-[10.5rem]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <span className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                    <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
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
                    ? "暂无语录，请点击「新建语录」添加。"
                    : "无匹配结果"}
                </TableCell>
              </TableRow>
            ) : (
              slice.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-md align-top">
                    <p
                      className="text-foreground leading-relaxed break-words"
                      title={
                        row.content.length > CONTENT_PREVIEW_MAX
                          ? row.content
                          : undefined
                      }
                    >
                      {formatContentPreview(row.content)}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground align-top">
                    {row.author?.trim() ? row.author : "—"}
                  </TableCell>
                  <TableCell className="align-top">
                    {row.tag?.trim() ? (
                      <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">
                        {row.tag}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openDetail(row)}
                      >
                        详情
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(row)}
                      >
                        编辑
                      </Button>
                    </div>
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

      <Dialog
        open={detailRow !== null}
        onOpenChange={(open) => {
          if (!open) setDetailRow(null)
        }}
      >
        <DialogContent
          showCloseButton
          className="flex max-h-[min(88vh,52rem)] w-[min(100vw-2rem,72rem)] max-w-[min(100vw-2rem,72rem)] flex-col gap-4 overflow-hidden p-6 text-base sm:gap-6 sm:p-8 sm:max-w-6xl"
        >
          <DialogHeader className="shrink-0 space-y-2 text-left">
            <DialogTitle className="text-xl sm:text-2xl">语录详情</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            <p className="text-foreground text-lg leading-relaxed break-words whitespace-pre-wrap sm:text-xl sm:leading-relaxed">
              {detailRow?.content ?? ""}
            </p>
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDetailRow(null)}
            >
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <TradeWisdomFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onSubmit={handleMutate}
      />
    </section>
  )
}
