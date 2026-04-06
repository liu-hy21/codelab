import { z } from "zod"

const optionalNumber = z
  .union([z.string(), z.number()])
  .optional()
  .transform((val) => {
    if (val === "" || val === undefined || val === null) return undefined
    const n = typeof val === "string" ? Number(val) : val
    return Number.isFinite(n) ? n : undefined
  })

export const datingTargetFormSchema = z.object({
  name: z.string().optional(),
  birthday: z.string().optional(),
  hometown: z.string().optional(),
  currentCity: z.string().optional(),
  height: optionalNumber,
  weight: optionalNumber,
  undergraduateSchool: z.string().optional(),
  graduateSchool: z.string().optional(),
  job: z.string().optional(),
  income: optionalNumber,
  company: z.string().optional(),
  phone: z.string().optional(),
  wechat: z.string().optional(),
  linkWay: z.string().optional(),
  strength: z.string().optional(),
  weakness: z.string().optional(),
  loveView: z.string().optional(),
  moneyView: z.string().optional(),
  valueView: z.string().optional(),
})

export type DatingTargetFormInput = z.input<typeof datingTargetFormSchema>
export type DatingTargetFormValues = z.output<typeof datingTargetFormSchema>

export const datingTargetUpdateFormSchema = datingTargetFormSchema.extend({
  id: z.coerce.number().int().positive(),
})

export type DatingTargetUpdateFormInput = z.input<
  typeof datingTargetUpdateFormSchema
>
export type DatingTargetUpdateFormValues = z.output<
  typeof datingTargetUpdateFormSchema
>

export const talkWisdomMutateSchema = z.object({
  id: z.number().int().positive().optional(),
  content: z.string().min(1, "内容不能为空"),
  scene: z.string().optional(),
  tag: z.string().optional(),
})

export type TalkWisdomMutateValues = z.infer<typeof talkWisdomMutateSchema>

export const datingChatRecordEntrySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式必须为 yyyy-MM-dd"),
  role: z.enum(["我", "她"]),
  content: z.string().min(1, "内容不能为空"),
})

export const datingChatRecordEntryFormSchema = datingChatRecordEntrySchema.extend({
  content: z.string().min(1, "内容不能为空").max(5000, "内容过长"),
})

export type DatingChatRecordEntry = z.infer<typeof datingChatRecordEntrySchema>
export type DatingChatRecordEntryFormValues = z.infer<
  typeof datingChatRecordEntryFormSchema
>
