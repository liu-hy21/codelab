import { useCallback, useState } from "react"
import { fetchTradeTargetList } from "../api/trade-target"
import type { TradeTargetQueryRequest, TradeTargetVO } from "../types"

type Result = {
  list: TradeTargetVO[]
  loading: boolean
  error: string | null
  query: (filters?: TradeTargetQueryRequest) => Promise<void>
}

export const useTradeTargetQuery = (): Result => {
  const [list, setList] = useState<TradeTargetVO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const query = useCallback(async (filters: TradeTargetQueryRequest = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTradeTargetList(filters)
      setList(data)
    } catch (e) {
      const message = e instanceof Error ? e.message : "加载失败"
      setError(message)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { list, loading, error, query }
}
