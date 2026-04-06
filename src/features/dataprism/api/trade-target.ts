import request from "@/lib/request"
import type {
  CommonResponse,
  TradeTargetAddRequest,
  TradeTargetQueryRequest,
  TradeTargetUpdateRequest,
  TradeTargetVO,
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

export const fetchTradeTargetList = async (
  body: TradeTargetQueryRequest = {}
): Promise<TradeTargetVO[]> => {
  const res = await request.post<CommonResponse<TradeTargetVO[]>>(
    "/trade/target/query",
    body
  )
  if (!res.success || res.code !== 200) {
    throw new Error(res.msg || "请求失败")
  }
  return Array.isArray(res.data) ? res.data : []
}

export const addTradeTarget = async (
  body: TradeTargetAddRequest
): Promise<TradeTargetVO> => {
  const res = await request.post<CommonResponse<TradeTargetVO>>(
    "/trade/target/add",
    body
  )
  return unwrap(res)
}

export const updateTradeTarget = async (
  body: TradeTargetUpdateRequest
): Promise<TradeTargetVO> => {
  const res = await request.post<CommonResponse<TradeTargetVO>>(
    "/trade/target/update",
    body
  )
  return unwrap(res)
}
