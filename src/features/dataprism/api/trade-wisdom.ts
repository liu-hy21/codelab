import request from "@/lib/request"
import type {
  CommonResponse,
  TradeWisdomAddRequest,
  TradeWisdomUpdateRequest,
  TradeWisdomVO,
} from "../types"

const unwrap = <T>(res: CommonResponse<T>): T => {
  if (!res.success || res.code !== 200) {
    throw new Error(res.msg || "请求失败")
  }
  if (res.data === null || res.data === undefined) {
    throw new Error("响应数据为空")
  }
  return res.data
}

export const fetchTradeWisdomList = async (): Promise<TradeWisdomVO[]> => {
  const res = await request.get<CommonResponse<TradeWisdomVO[]>>(
    "/trade/getTradeWisdomList"
  )
  if (!res.success || res.code !== 200) {
    throw new Error(res.msg || "请求失败")
  }
  return Array.isArray(res.data) ? res.data : []
}

export const addTradeWisdom = async (
  body: TradeWisdomAddRequest
): Promise<TradeWisdomVO> => {
  const res = await request.post<CommonResponse<TradeWisdomVO>>(
    "/trade/add",
    body
  )
  return unwrap(res)
}

export const updateTradeWisdom = async (
  body: TradeWisdomUpdateRequest
): Promise<TradeWisdomVO> => {
  const res = await request.post<CommonResponse<TradeWisdomVO>>(
    "/trade/update",
    body
  )
  return unwrap(res)
}
