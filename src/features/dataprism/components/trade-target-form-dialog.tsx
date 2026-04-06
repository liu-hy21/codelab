"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TRADE_TARGET_MARKETS } from "../constants"
import {
  tradeTargetMutateSchema,
  type TradeTargetMutateValues,
} from "../schema/trade-target"
import type { TradeTargetVO } from "../types"

type TradeTargetFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initial: TradeTargetVO | null
  onSubmit: (values: TradeTargetMutateValues) => Promise<void>
}

const emptyValues = (): TradeTargetMutateValues => ({
  code: "",
  cnName: "",
  market: TRADE_TARGET_MARKETS[0],
})

const normalizeMarket = (value: string): TradeTargetMutateValues["market"] =>
  (TRADE_TARGET_MARKETS as readonly string[]).includes(value)
    ? (value as TradeTargetMutateValues["market"])
    : TRADE_TARGET_MARKETS[0]

export const TradeTargetFormDialog = ({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
}: TradeTargetFormDialogProps) => {
  const form = useForm<TradeTargetMutateValues>({
    resolver: zodResolver(tradeTargetMutateSchema),
    defaultValues: emptyValues(),
  })

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && initial) {
      form.reset({
        id: initial.id,
        code: initial.code,
        cnName: initial.cnName,
        market: normalizeMarket(initial.market),
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
            {mode === "create" ? "新建标的" : "编辑标的"}
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标的代码</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="如：600519"
                      autoComplete="off"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>中文名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="如：贵州茅台"
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
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属市场</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择市场" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRADE_TARGET_MARKETS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
