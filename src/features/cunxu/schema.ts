import { z } from "zod"

export const lifeTipFormSchema = z.object({
  title: z.string().min(1, "请输入标题"),
  summary: z.string().optional(),
  body: z.string().optional(),
  tagsText: z.string().optional(),
  isPinned: z.boolean(),
  isFavorite: z.boolean(),
})

export type LifeTipFormValues = z.infer<typeof lifeTipFormSchema>

export const parseTagsFromText = (raw: string | undefined): string[] => {
  if (!raw?.trim()) return []
  return raw
    .split(/[,，;；]/)
    .map((s) => s.trim())
    .filter(Boolean)
}
