import type { LifeTipCategory } from "./types"

export const CUNXU_TABS: ReadonlyArray<{
  key: LifeTipCategory
  label: string
}> = [
  { key: "HEALTH", label: "健康" },
  { key: "COOKING", label: "做饭" },
  { key: "CHORE", label: "家务" },
  { key: "DRIVING", label: "开车" },
  { key: "TRAVEL", label: "旅行" },
  { key: "SPENDING", label: "消费" },
  { key: "DINING", label: "吃饭" },
  { key: "RENOVATION", label: "装修" },
  { key: "LEISURE", label: "娱乐" },
]

const KEYS = CUNXU_TABS.map((t) => t.key)

export const isLifeTipCategory = (v: string | null): v is LifeTipCategory =>
  v !== null && (KEYS as readonly string[]).includes(v)

export const categoryLabel = (k: LifeTipCategory): string =>
  CUNXU_TABS.find((t) => t.key === k)?.label ?? k
