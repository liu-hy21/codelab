import { useEffect, useState } from "react"
import { buildMockInstrumentSeries } from "../lib/mock-chart-series"
import type { ChartRange, InstrumentSeries } from "../types"

type State = {
  loading: boolean
  series: InstrumentSeries[]
}

export const usePrismChartData = (range: ChartRange): State => {
  const [state, setState] = useState<State>({
    loading: true,
    series: [],
  })

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }))
    const timer = window.setTimeout(() => {
      setState({
        loading: false,
        series: buildMockInstrumentSeries(range),
      })
    }, 320)
    return () => window.clearTimeout(timer)
  }, [range])

  return state
}
