"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { LifeTip } from "../types"

const dateFmt = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
})

type TipDetailDialogProps = {
  tip: LifeTip | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: () => void
  deleteOpen: boolean
  onDeleteOpenChange: (open: boolean) => void
}

export const TipDetailDialog = ({
  tip,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  deleteOpen,
  onDeleteOpenChange,
}: TipDetailDialogProps) => {
  if (!tip) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-pretty">{tip.title}</DialogTitle>
              {tip.isPinned ? (
                <Badge variant="secondary">置顶</Badge>
              ) : null}
              {tip.isFavorite ? (
                <Badge variant="outline">常用</Badge>
              ) : null}
            </div>
            <DialogDescription className="text-muted-foreground text-sm">
              更新于 {dateFmt.format(new Date(tip.updatedAt))}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {tip.summary ? (
              <p className="text-foreground/90 text-sm leading-relaxed">
                {tip.summary}
              </p>
            ) : null}
            {tip.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1" role="list" aria-label="标签">
                {tip.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="border-border rounded-md border bg-muted/30 p-3">
              <h3 className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                正文
              </h3>
              <pre className="text-foreground/95 font-sans text-sm break-words whitespace-pre-wrap">
                {tip.body?.trim() ? tip.body : "（无正文）"}
              </pre>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              关闭
            </Button>
            <Button type="button" variant="outline" onClick={onEdit}>
              编辑
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => onDeleteOpenChange(true)}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent className="overscroll-y-contain">
          <AlertDialogHeader>
            <AlertDialogTitle>删除这条记录？</AlertDialogTitle>
            <AlertDialogDescription>
              「{tip.title}」将被移除，此操作可在刷新页面前通过重新添加补救（当前为前端演示数据）。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete()
                onDeleteOpenChange(false)
                onOpenChange(false)
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
