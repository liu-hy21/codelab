import { useEffect, useMemo, useState } from "react"
import { fetchChartSeries } from "../api/chart-series"
import { fetchTradeTargetList } from "../api/trade-target"
import { loadChartCache, saveChartCache } from "../lib/chart-cache"
import {
  filterSeriesByDisplaySymbols,
  orderedCodesFromTargets,
  sliceSeriesByRange,
} from "../lib/slice-chart-series"
import type { ChartRange, InstrumentSeries } from "../types"

type State = {
  loading: boolean
  /** 已按标的配置 `code` 过滤、并按 `range` 切片后的序列 */
  series: InstrumentSeries[]
  error: string | null
  /** 标的配置中有效 `code` 数量（用于空态文案） */
  targetCodeCount: number
}

/**
 * 每个自然日最多请求一次 `range=3Y` 走势图并本地缓存；
 * 展示标的来自「标的配置」全量列表的 `code`（与走势 `symbol` 规范化后匹配）。
 */
export const usePrismChartData = (range: ChartRange): State => {
  const [baseSeries, setBaseSeries] = useState<InstrumentSeries[] | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [targetCodeCount, setTargetCodeCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const [chartPayload, targets] = await Promise.all([
          (async () => {
            const cached = loadChartCache()
            if (cached) return cached
            const fresh = await fetchChartSeries("3Y")
            saveChartCache(fresh)
            return fresh
          })(),
          fetchTradeTargetList({}),
        ])
        if (cancelled) return

        const orderedCodes = orderedCodesFromTargets(
          targets.map((t) => t.code)
        )
        const filtered = filterSeriesByDisplaySymbols(
          chartPayload.series,
          orderedCodes
        )
        setTargetCodeCount(orderedCodes.length)
        setBaseSeries(filtered)
        setLoading(false)
      } catch (e) {
        const message = e instanceof Error ? e.message : "加载失败"
        if (!cancelled) {
          setBaseSeries([])
          setTargetCodeCount(0)
          setError(message)
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const series = useMemo(() => {
    if (!baseSeries || baseSeries.length === 0) return []
    return sliceSeriesByRange(baseSeries, range)
  }, [baseSeries, range])

  return {
    loading,
    series,
    error,
    targetCodeCount,
  }
}
