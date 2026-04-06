import request from "@/lib/request"
import type {
  CommonResponse,
  DatingTargetAddRequest,
  DatingTargetChatRecordUpdateRequest,
  DatingTargetUpdateRequest,
  DatingTargetVO,
  TalkWisdomAddRequest,
  TalkWisdomUpdateRequest,
  TalkWisdomVO,
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

export const updateDatingTargetChatRecord = async (
  body: DatingTargetChatRecordUpdateRequest
): Promise<DatingTargetVO> => {
  const res = await request.post<CommonResponse<DatingTargetVO>>(
    "/dating/chatRecord/update",
    body
  )
  return unwrap(res)
}

export const fetchTalkWisdomList = async (): Promise<TalkWisdomVO[]> => {
  const res = await request.get<CommonResponse<TalkWisdomVO[]>>(
    "/dating/getTalkWisdomList"
  )
  if (!res.success || res.code !== 200) {
    throw new Error(res.msg || "请求失败")
  }
  return Array.isArray(res.data) ? res.data : []
}

export const addTalkWisdom = async (
  body: TalkWisdomAddRequest
): Promise<TalkWisdomVO> => {
  const res = await request.post<CommonResponse<TalkWisdomVO>>(
    "/dating/talk/add",
    body
  )
  return unwrap(res)
}

export const updateTalkWisdom = async (
  body: TalkWisdomUpdateRequest
): Promise<TalkWisdomVO> => {
  const res = await request.post<CommonResponse<TalkWisdomVO>>(
    "/dating/talk/update",
    body
  )
  return unwrap(res)
}
