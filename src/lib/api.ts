import request from "./request"

// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 用户相关 API
export const userApi = {
  // 登录
  login: (data: { username: string; password: string }) => {
    return request.post<ApiResponse<{ token: string; user: any }>>('/auth/login', data)
  },
  
  // 注册
  register: (data: { username: string; password: string; email: string }) => {
    return request.post<ApiResponse<{ user: any }>>('/auth/register', data)
  },
  
  // 获取当前用户信息
  getCurrentUser: () => {
    return request.get<ApiResponse<any>>('/user/me')
  },
  
  // 获取用户列表
  getUsers: (params?: { page?: number; pageSize?: number }) => {
    return request.get<ApiResponse<{ list: any[]; total: number }>>('/users', { params })
  }
}

// 其他API模块可以在这里添加
export const otherApi = {
  // 示例API
  getExample: () => {
    return request.get<ApiResponse<any>>('/example')
  }
}
