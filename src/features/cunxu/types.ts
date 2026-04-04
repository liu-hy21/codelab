export type LifeTipCategory =
  | "HEALTH"
  | "COOKING"
  | "CHORE"
  | "DRIVING"
  | "TRAVEL"
  | "SPENDING"
  | "DINING"
  | "RENOVATION"
  | "LEISURE"

export type LifeTip = {
  id: string
  title: string
  summary: string
  body: string
  category: LifeTipCategory
  tags: string[]
  isPinned: boolean
  isFavorite: boolean
  updatedAt: string
}
