import { useEffect, useState } from "react"
import {
  getMockIndexMetrics,
  getMockWatchlistMetricRows,
} from "../lib/mock-metrics"
import type { IndexMetricSnapshot, WatchlistMetricRow } from "../types"

type MetricsBoardState = {
  loading: boolean
  indexMetrics: IndexMetricSnapshot[]
  watchlist: WatchlistMetricRow[]
}

export const useMetricsBoardData = (): MetricsBoardState => {
  const [state, setState] = useState<MetricsBoardState>({
    loading: true,
    indexMetrics: [],
    watchlist: [],
  })

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }))
    const t = window.setTimeout(() => {
      setState({
        loading: false,
        indexMetrics: getMockIndexMetrics(),
        watchlist: getMockWatchlistMetricRows(),
      })
    }, 360)
    return () => window.clearTimeout(t)
  }, [])

  return state
}
