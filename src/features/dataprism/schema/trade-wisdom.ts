import { z } from "zod"

/** 新建与编辑共用：无 id 为新建，有 id 为编辑（id 由隐藏域 + valueAsNumber 提交） */
export const tradeWisdomMutateSchema = z.object({
  id: z.number().int().positive().optional(),
  content: z.string().min(1, "内容不能为空"),
  author: z.string().optional(),
  tag: z.string().optional(),
})

export type TradeWisdomMutateValues = z.infer<typeof tradeWisdomMutateSchema>
