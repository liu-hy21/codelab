"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { categoryLabel } from "../constants"
import { lifeTipFormSchema, parseTagsFromText, type LifeTipFormValues } from "../schema"
import type { LifeTip, LifeTipCategory } from "../types"

type TipFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  category: LifeTipCategory
  initial?: LifeTip | null
  onSubmit: (values: LifeTipFormValues, category: LifeTipCategory, tags: string[]) => void
}

const defaultValues = (): LifeTipFormValues => ({
  title: "",
  summary: "",
  body: "",
  tagsText: "",
  isPinned: false,
  isFavorite: false,
})

export const TipFormDialog = ({
  open,
  onOpenChange,
  mode,
  category,
  initial,
  onSubmit,
}: TipFormDialogProps) => {
  const form = useForm<LifeTipFormValues>({
    resolver: zodResolver(lifeTipFormSchema),
    defaultValues: defaultValues(),
  })

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && initial) {
      form.reset({
        title: initial.title,
        summary: initial.summary,
        body: initial.body,
        tagsText: initial.tags.join("，"),
        isPinned: initial.isPinned,
        isFavorite: initial.isFavorite,
      })
    } else {
      form.reset(defaultValues())
    }
  }, [open, mode, initial, form])

  const handleSubmit = form.handleSubmit((values) => {
    const tags = parseTagsFromText(values.tagsText)
    onSubmit(values, category, tags)
    onOpenChange(false)
    form.reset(defaultValues())
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "新建技巧" : "编辑技巧"}
          </DialogTitle>
          <DialogDescription>
            场景：
            <span className="text-foreground font-medium">
              {categoryLabel(category)}
            </span>
            。正文支持 Markdown 习惯书写。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="简短标题…" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>摘要</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="列表中显示的一行摘要…"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>正文</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="步骤、禁忌、踩坑记录…"
                      className="min-h-32 resize-y"
                      spellCheck={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标签</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="多个用逗号分隔…"
                      autoComplete="off"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>中英文逗号均可</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(c) => field.onChange(c === true)}
                        aria-label="置顶"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">置顶</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFavorite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(c) => field.onChange(c === true)}
                        aria-label="常用"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">常用</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.root ? (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
