import type { ChartRange, ChartSeriesResponse } from "../types"

const chartApiBase = (): string => {
  const raw = process.env.NEXT_PUBLIC_CHART_API_URL
  if (typeof raw === "string" && raw.trim().length > 0) {
    return raw.replace(/\/$/, "")
  }
  return "http://127.0.0.1:8000"
}

const parseErrorBody = async (res: Response): Promise<string> => {
  try {
    const body: unknown = await res.json()
    if (body && typeof body === "object" && "detail" in body) {
      const detail = (body as { detail: unknown }).detail
      if (Array.isArray(detail)) {
        const first = detail[0]
        if (first && typeof first === "object") {
          if ("msg" in first) return String((first as { msg: string }).msg)
          if ("message" in first) {
            return String((first as { message: string }).message)
          }
        }
        return JSON.stringify(detail)
      }
      if (detail && typeof detail === "object" && "message" in detail) {
        return String((detail as { message: string }).message)
      }
      if (typeof detail === "string") return detail
    }
  } catch {
    /* fall through */
  }
  return res.statusText || `请求失败 (${res.status})`
}

/**
 * 全品种收盘价序列（FastAPI，非 Java `/codelab` 网关）。
 * @see 仓库内走势看板 API 说明
 */
export const fetchChartSeries = async (
  range: ChartRange
): Promise<ChartSeriesResponse> => {
  const base = chartApiBase()
  const url = `${base}/api/v1/chart/series?range=${encodeURIComponent(range)}`
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(await parseErrorBody(res))
  }
  const data = (await res.json()) as ChartSeriesResponse
  if (!data || !Array.isArray(data.series)) {
    throw new Error("响应格式异常：缺少 series")
  }
  return data
}
