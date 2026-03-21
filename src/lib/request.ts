import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios"

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回 data
    return response.data
  },
  (error: AxiosError) => {
    // 处理错误
    if (error.response) {
      const status = error.response.status
      
      // 401 未授权
      if (status === 401) {
        // 清除 token
        localStorage.removeItem("token")
        // 跳转到登录页
        window.location.href = "/login"
      }
      
      // 403 禁止访问
      if (status === 403) {
        console.error("权限不足")
      }
      
      // 500 服务器错误
      if (status === 500) {
        console.error("服务器错误")
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error("网络错误，请检查连接")
    } else {
      // 请求配置错误
      console.error("请求错误:", error.message)
    }
    
    return Promise.reject(error)
  }
)

export default request
