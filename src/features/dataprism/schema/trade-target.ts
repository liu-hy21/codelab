import { z } from "zod"
import { TRADE_TARGET_MARKETS } from "../constants"

/** 新建与编辑共用：无 id 为新建；编辑时带 id */
export const tradeTargetMutateSchema = z.object({
  id: z.number().int().positive().optional(),
  code: z.string().min(1, "标的代码不能为空"),
  cnName: z.string().min(1, "中文名不能为空"),
  market: z.enum(TRADE_TARGET_MARKETS, {
    error: "请选择所属市场",
  }),
})

export type TradeTargetMutateValues = z.infer<typeof tradeTargetMutateSchema>
