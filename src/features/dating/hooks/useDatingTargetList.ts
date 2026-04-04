import { useCallback, useEffect, useState } from "react"
import { fetchDatingTargetList } from "../api"
import type { DatingTargetVO } from "../types"

type UseDatingTargetListResult = {
  list: DatingTargetVO[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useDatingTargetList = (): UseDatingTargetListResult => {
  const [list, setList] = useState<DatingTargetVO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchDatingTargetList()
      setList(data)
    } catch (e) {
      const message = e instanceof Error ? e.message : "加载失败"
      setError(message)
      setList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { list, loading, error, refetch }
}
