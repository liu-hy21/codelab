"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  talkWisdomMutateSchema,
  type TalkWisdomMutateValues,
} from "../schema"
import type { TalkWisdomVO } from "../types"

type TalkWisdomFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initial: TalkWisdomVO | null
  onSubmit: (values: TalkWisdomMutateValues) => Promise<void>
}

const emptyValues = (): TalkWisdomMutateValues => ({
  content: "",
  scene: "",
  tag: "",
})

export const TalkWisdomFormDialog = ({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
}: TalkWisdomFormDialogProps) => {
  const form = useForm<TalkWisdomMutateValues>({
    resolver: zodResolver(talkWisdomMutateSchema),
    defaultValues: emptyValues(),
  })

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && initial) {
      form.reset({
        id: initial.id,
        content: initial.content,
        scene: initial.scene ?? "",
        tag: initial.tag ?? "",
      })
    } else {
      form.reset(emptyValues())
    }
  }, [open, mode, initial, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      onOpenChange(false)
      form.reset(emptyValues())
    } catch (e) {
      const msg = e instanceof Error ? e.message : "保存失败"
      form.setError("root", { message: msg })
    }
  })

  const submitting = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "新建语录" : "编辑语录"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "edit" && initial ? (
              <input
                type="hidden"
                {...form.register("id", { valueAsNumber: true })}
              />
            ) : null}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="交流智慧正文…"
                      className="min-h-28 resize-y"
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
              name="scene"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>场景</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="可留空，如：约会、矛盾"
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
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标签</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="如：沟通、情绪"
                      autoComplete="off"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root ? (
              <p className="text-destructive text-sm" role="alert">
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
              <Button type="submit" disabled={submitting}>
                {submitting ? "保存中…" : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
