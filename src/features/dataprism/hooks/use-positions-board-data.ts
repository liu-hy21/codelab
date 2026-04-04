import { useEffect, useState } from "react"
import { getMockPositionRows } from "../lib/mock-positions"
import type { PositionInstrumentRow } from "../types"

type State = {
  loading: boolean
  rows: PositionInstrumentRow[]
}

export const usePositionsBoardData = (): State => {
  const [state, setState] = useState<State>({ loading: true, rows: [] })

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }))
    const t = window.setTimeout(() => {
      setState({ loading: false, rows: getMockPositionRows() })
    }, 340)
    return () => window.clearTimeout(t)
  }, [])

  return state
}
