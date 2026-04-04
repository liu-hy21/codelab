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
