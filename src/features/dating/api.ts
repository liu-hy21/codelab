import request from "@/lib/request"
import type {
  CommonResponse,
  DatingTargetAddRequest,
  DatingTargetUpdateRequest,
  DatingTargetVO,
} from "./types"

const unwrap = <T>(res: CommonResponse<T>): T => {
  if (!res.success || res.code !== 200) {
    throw new Error(res.msg || "请求失败")
  }
  if (res.data === null || res.data === undefined) {
    throw new Error("响应数据为空")
  }
  return res.data
}

export const fetchDatingTargetList = async (): Promise<DatingTargetVO[]> => {
  const res = await request.get<CommonResponse<DatingTargetVO[]>>(
    "/dating/getDatingTargetList"
  )
  if (!res.success || res.code !== 200) {
    throw new Error(res.msg || "请求失败")
  }
  return Array.isArray(res.data) ? res.data : []
}

export const addDatingTarget = async (
  body: DatingTargetAddRequest
): Promise<DatingTargetVO> => {
  const res = await request.post<CommonResponse<DatingTargetVO>>(
    "/dating/add",
    body
  )
  return unwrap(res)
}

export const updateDatingTarget = async (
  body: DatingTargetUpdateRequest
): Promise<DatingTargetVO> => {
  const res = await request.post<CommonResponse<DatingTargetVO>>(
    "/dating/update",
    body
  )
  return unwrap(res)
}
