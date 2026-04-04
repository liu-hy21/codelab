"use client"

import { useMemo, useState } from "react"
import { PinIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { categoryLabel } from "../constants"
import type { LifeTip, LifeTipCategory } from "../types"
import type { LifeTipFormValues } from "../schema"
import { useCunxuStore } from "../store"
import { TipDetailDialog } from "./tip-detail-dialog"
import { TipFormDialog } from "./tip-form-dialog"

const PAGE_SIZE = 8

const listDateFmt = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
})

type TipScenePanelProps = {
  category: LifeTipCategory
}

export const TipScenePanel = ({ category }: TipScenePanelProps) => {
  const tips = useCunxuStore((s) => s.tips)
  const addTip = useCunxuStore((s) => s.addTip)
  const updateTip = useCunxuStore((s) => s.updateTip)
  const removeTip = useCunxuStore((s) => s.removeTip)

  const [query, setQuery] = useState("")
  const [favoriteOnly, setFavoriteOnly] = useState(false)
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<LifeTip | null>(null)

  const [detailTip, setDetailTip] = useState<LifeTip | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    const inCategory = tips.filter((t) => t.category === category)
    const scoped = favoriteOnly
      ? inCategory.filter((t) => t.isFavorite)
      : inCategory
    const searched = !q
      ? scoped
      : scoped.filter((t) => {
          const inTags = t.tags.some((x) => x.toLowerCase().includes(q))
          return (
            t.title.toLowerCase().includes(q) ||
            t.summary.toLowerCase().includes(q) ||
            (t.body && t.body.toLowerCase().includes(q)) ||
            inTags
          )
        })
    return [...searched].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    })
  }, [tips, category, query, favoriteOnly])

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredSorted.slice(start, start + PAGE_SIZE)
  }, [filteredSorted, safePage])

  const searchId = `cunxu-search-${category}`

  const openCreate = () => {
    setFormMode("create")
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = () => {
    if (!detailTip) return
    setFormMode("edit")
    setEditing(detailTip)
    setDetailOpen(false)
    setFormOpen(true)
  }

  const handleFormSubmit = (
    values: LifeTipFormValues,
    cat: LifeTipCategory,
    tags: string[]
  ) => {
    const payload = {
      title: values.title,
      summary: values.summary ?? "",
      body: values.body ?? "",
      category: cat,
      tags,
      isPinned: values.isPinned,
      isFavorite: values.isFavorite,
    }
    if (formMode === "create") {
      addTip(payload)
    } else if (editing) {
      updateTip(editing.id, payload)
    }
  }

  const liveMsg =
    filteredSorted.length === 0
      ? "当前筛选下无条目"
      : `共 ${filteredSorted.length} 条记录`

  return (
    <section
      className="space-y-6"
      aria-label={`${categoryLabel(category)}场景下的技巧列表`}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMsg}
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-md min-w-0 flex-1 flex-col gap-2">
          <label htmlFor={searchId} className="text-sm font-medium">
            搜索标题、摘要、正文或标签
          </label>
          <Input
            id={searchId}
            name="cunxu-tip-search"
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
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant={favoriteOnly ? "default" : "outline"}
            size="sm"
            className="touch-manipulation"
            aria-pressed={favoriteOnly}
            onClick={() => {
              setFavoriteOnly((v) => !v)
              setPage(1)
            }}
          >
            仅看常用
          </Button>
          <Button
            type="button"
            className="touch-manipulation"
            onClick={openCreate}
          >
            新建技巧
          </Button>
        </div>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-sm tabular-nums">
        <span>
          {categoryLabel(category)} · {filteredSorted.length} 条
          {filteredSorted.length > PAGE_SIZE
            ? ` · 第 ${safePage} / ${totalPages} 页`
            : null}
        </span>
      </div>

      {pageSlice.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground py-12 text-center text-sm">
            {tips.filter((t) => t.category === category).length === 0
              ? "该场景下还没有记录，点击「新建技巧」添加。"
              : "没有符合筛选条件的记录，试试清空搜索或关闭「仅看常用」。"}
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pageSlice.map((tip) => (
            <li key={tip.id}>
              <button
                type="button"
                className="border-border bg-card text-card-foreground hover:bg-accent/50 focus-visible:ring-ring h-full w-full min-w-0 rounded-xl border text-left transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                onClick={() => {
                  setDetailTip(tip)
                  setDetailOpen(true)
                }}
              >
                <Card className="h-full border-0 shadow-none">
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex min-w-0 flex-wrap items-start gap-2">
                      <CardTitle className="line-clamp-2 text-base leading-snug">
                        {tip.title}
                      </CardTitle>
                      {tip.isPinned ? (
                        <PinIcon
                          className="text-primary size-4 shrink-0"
                          aria-hidden="true"
                        />
                      ) : null}
                      {tip.isFavorite ? (
                        <StarIcon
                          className="text-amber-600 size-4 shrink-0 dark:text-amber-500"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {tip.summary || "（无摘要）"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div className="flex flex-wrap gap-1">
                      {tip.tags.slice(0, 4).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs tabular-nums">
                      更新 {listDateFmt.format(new Date(tip.updatedAt))}
                    </p>
                  </CardContent>
                </Card>
              </button>
            </li>
          ))}
        </ul>
      )}

      {filteredSorted.length > PAGE_SIZE ? (
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

      <TipFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        category={(formMode === "edit" && editing ? editing.category : category)}
        initial={formMode === "edit" ? editing : null}
        onSubmit={handleFormSubmit}
      />

      <TipDetailDialog
        tip={detailTip}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={openEdit}
        onDelete={() => {
          if (detailTip) {
            removeTip(detailTip.id)
            setDetailTip(null)
          }
        }}
        deleteOpen={deleteOpen}
        onDeleteOpenChange={setDeleteOpen}
      />
    </section>
  )
}
