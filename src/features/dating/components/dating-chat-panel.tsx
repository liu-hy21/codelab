"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { cn } from "@/lib/utils"
import { updateDatingTargetChatRecord } from "../api"
import {
  datingChatRecordEntryFormSchema,
  datingChatRecordEntrySchema,
  type DatingChatRecordEntry,
  type DatingChatRecordEntryFormValues,
} from "../schema"
import type { DatingTargetVO } from "../types"

type DatingChatPanelProps = {
  target: DatingTargetVO | null
  onSaved: (target: DatingTargetVO) => void
}

const today = () => new Date().toISOString().slice(0, 10)

const emptyValues = (): DatingChatRecordEntryFormValues => ({
  date: today(),
  role: "我",
  content: "",
})

const parseChatRecord = (raw: string | null): DatingChatRecordEntry[] => {
  if (!raw?.trim()) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => datingChatRecordEntrySchema.safeParse(item))
      .filter((item) => item.success)
      .map((item) => item.data)
  } catch {
    return []
  }
}

export const DatingChatPanel = ({ target, onSaved }: DatingChatPanelProps) => {
  const [records, setRecords] = useState<DatingChatRecordEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const form = useForm<DatingChatRecordEntryFormValues>({
    resolver: zodResolver(datingChatRecordEntryFormSchema),
    defaultValues: emptyValues(),
  })

  useEffect(() => {
    setRecords(parseChatRecord(target?.chatRecord ?? null))
    setError(null)
    form.reset(emptyValues())
  }, [target, form])

  const onAddRecord = form.handleSubmit((values) => {
    const next = {
      date: values.date,
      role: values.role,
      content: values.content.trim(),
    }
    setRecords((prev) => [...prev, next])
    form.reset({
      date: values.date,
      role: values.role,
      content: "",
    })
    setError(null)
  })

  const onSave = async () => {
    if (!target) return
    setSaving(true)
    setError(null)
    try {
      const payload = JSON.stringify(records)
      const updated = await updateDatingTargetChatRecord({
        id: target.id,
        chatRecord: payload,
      })
      onSaved(updated)
    } catch (e) {
      const message = e instanceof Error ? e.message : "保存失败"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (!target) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>聊天录入</CardTitle>
          <CardDescription>请先在「人物数据」中点击某个对象的「录入聊天」。</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <section className="space-y-4" aria-labelledby="dating-chat-heading">
      <div className="space-y-1">
        <h2 id="dating-chat-heading" className="text-xl font-semibold">
          聊天录入
        </h2>
        <p className="text-muted-foreground text-sm">
          当前对象：{target.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">新增一条消息</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onAddRecord} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>日期</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>角色</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={field.value === "她" ? "default" : "outline"}
                            onClick={() => field.onChange("她")}
                          >
                            她
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "我" ? "default" : "outline"}
                            onClick={() => field.onChange("我")}
                          >
                            我
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="hidden sm:block" />
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>消息内容</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="输入聊天内容…"
                        className="min-h-24 resize-y"
                        autoComplete="off"
                        spellCheck={false}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">添加到记录</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">会话预览</CardTitle>
          <CardDescription>共 {records.length} 条消息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto rounded-md border p-3 overscroll-contain">
            {records.length === 0 ? (
              <p className="text-muted-foreground text-sm">暂无消息，请先录入。</p>
            ) : (
              records.map((row, index) => {
                const mine = row.role === "我"
                return (
                  <div
                    key={`${row.date}-${row.role}-${index}`}
                    className={cn("flex", mine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm break-words",
                        mine ? "bg-green-500 text-white" : "bg-background border"
                      )}
                    >
                      <p
                        className={cn(
                          "mb-1 text-xs",
                          mine ? "text-green-50" : "text-muted-foreground"
                        )}
                      >
                        {row.date} · {row.role}
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">{row.content}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {error ? (
            <p className="text-destructive mt-3 text-sm" role="alert" aria-live="polite">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={onSave} disabled={saving}>
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
                  保存中…
                </span>
              ) : (
                "保存聊天记录"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
