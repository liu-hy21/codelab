export interface CommonResponse<T> {
  success: boolean
  code: number
  msg: string
  data: T
}

export interface DatingTargetInfo {
  birthday?: string | null
  constellation?: string | null
  zodiac?: string | null
  hometown?: string | null
  currentCity?: string | null
  height?: number | null
  weight?: number | null
  bodyFatRate?: number | null
  undergraduateSchool?: string | null
  graduateSchool?: string | null
  job?: string | null
  income?: number | null
  company?: string | null
  phone?: string | null
  wechat?: string | null
  linkWay?: string | null
  strength?: string | null
  weakness?: string | null
  loveView?: string | null
  moneyView?: string | null
  valueView?: string | null
}

export interface DatingTargetVO {
  id: number
  name: string
  info: DatingTargetInfo | null
  calculateIndex: string | null
  linkScore: string | null
}

export interface DatingTargetAddRequest {
  name?: string
  birthday?: string | number
  hometown?: string
  currentCity?: string
  height?: number
  weight?: number
  undergraduateSchool?: string
  graduateSchool?: string
  job?: string
  income?: number
  company?: string
  phone?: string
  wechat?: string
  linkWay?: string
  strength?: string
  weakness?: string
  loveView?: string
  moneyView?: string
  valueView?: string
}

export interface DatingTargetUpdateRequest extends DatingTargetAddRequest {
  id: number
}
