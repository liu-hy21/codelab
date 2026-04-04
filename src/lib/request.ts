import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  type AxiosRequestConfig,
} from "axios"

// 创建 axios 实例（先挂拦截器，再断言为解包后的客户端类型）
const raw: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001/codelab",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
raw.interceptors.request.use(
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
raw.interceptors.response.use(
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

/** 响应拦截器返回 `response.data`，故 `T` 为接口 JSON 体类型 */
export type ApiClient = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
}

const request = raw as unknown as ApiClient

export default request
