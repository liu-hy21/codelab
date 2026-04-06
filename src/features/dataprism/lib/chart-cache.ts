import type { ChartSeriesResponse } from "../types"

const CACHE_KEY = "dataprism-chart-3y-v1"

type CacheEnvelope = {
  /** 本地日历日 YYYY-MM-DD，与当日一致则视为有效 */
  date: string
  data: ChartSeriesResponse
}

const localToday = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** 读取当日有效的近三年缓存；过期或不存在返回 `null` */
export const loadChartCache = (): ChartSeriesResponse | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEnvelope
    if (!parsed?.data || typeof parsed.date !== "string") return null
    if (parsed.date !== localToday()) return null
    if (!Array.isArray(parsed.data.series)) return null
    return parsed.data
  } catch {
    return null
  }
}

/** 写入当日近三年全量响应（覆盖同日旧数据） */
export const saveChartCache = (data: ChartSeriesResponse): void => {
  if (typeof window === "undefined") return
  const env: CacheEnvelope = { date: localToday(), data }
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(env))
  } catch {
    /* 配额满等：忽略，上层仍可展示当次请求结果 */
  }
}
