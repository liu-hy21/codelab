# CLAUDE.md

## 项目概述

这是一个基于 Next.js 的现代 React 全栈项目，采用最新的技术栈和最佳实践构建。

## 技术栈

### 核心框架
- **Next.js 16** - React 全栈框架，支持 App Router
- **React 19** - 最新版本的 React，支持 React Compiler
- **TypeScript 5** - 类型安全的 JavaScript

### 样式方案
- **Tailwind CSS 4** - 原子化 CSS 框架
- **shadcn/ui** - 基于 Radix UI 的高质量组件库
- **Lucide React** - 图标库

### 状态管理
- **Zustand 5** - 轻量级状态管理
- **React Query (TanStack Query) 5** - 服务端状态管理

### 表单与验证
- **React Hook Form 7** - 高性能表单处理
- **Zod 4** - TypeScript 优先的 Schema 验证

### HTTP 客户端
- **Axios** - HTTP 请求库

## 项目结构

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── globals.css         # 全局样式
│   │   └── favicon.ico
│   ├── components/
│   │   └── ui/                 # shadcn/ui 组件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       └── table.tsx
│   └── lib/
│       ├── utils.ts            # 工具函数 (cn 等)
│       └── request.ts          # HTTP 请求封装
├── public/                     # 静态资源
├── components.json             # shadcn/ui 配置
├── next.config.ts              # Next.js 配置
├── package.json
└── tsconfig.json
```

## 开发规范

### 组件开发

#### 1. 使用 shadcn/ui 组件

```bash
# 添加新组件
npx shadcn add button
npx shadcn add card
```

#### 2. 样式编写规范

使用 Tailwind CSS 的类名组合，配合 `cn` 工具函数：

```tsx
import { cn } from "@/lib/utils"

// 基础用法
<div className={cn("flex items-center", className)}>

// 条件类名
<div className={cn(
  "flex items-center",
  isActive && "bg-primary",
  size === "lg" && "text-lg",
  className
)}>
```

#### 3. 组件 Props 定义

```tsx
import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  // ...
}
```

### 状态管理

#### Zustand Store 规范

```typescript
// stores/user-store.ts
import { create } from "zustand"

interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

#### React Query 规范

```typescript
// hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// 查询
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })
}

// 修改
export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
```

### 表单处理

#### React Hook Form + Zod

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6位"),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    // 处理提交
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("email")} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      <Button type="submit">登录</Button>
    </form>
  )
}
```

### HTTP 请求

#### Axios 封装规范

```typescript
// lib/request.ts
import axios from "axios"

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
    }
    return Promise.reject(error)
  }
)
```

## 可用脚本

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm run start

# 代码检查
npm run lint
```

## 路径别名

```typescript
// tsconfig.json 中配置的路径别名
@/components    # src/components
@/components/ui # src/components/ui
@/lib           # src/lib
@/hooks         # src/hooks
```

## 主题配置

项目使用 CSS 变量进行主题管理，支持亮色/暗色模式：

```css
/* globals.css */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

## 最佳实践

1. **组件设计**: 优先使用 shadcn/ui 组件，保持一致的视觉风格
2. **类型安全**: 所有 Props 和 API 响应都应定义 TypeScript 类型
3. **状态分离**: 服务端状态用 React Query，客户端状态用 Zustand
4. **表单验证**: 使用 Zod 进行运行时验证，配合 React Hook Form
5. **错误处理**: 统一在 Axios 拦截器中处理 API 错误
6. **性能优化**: 使用 React Compiler 自动优化渲染性能

## 注意事项

- 本项目使用 Next.js App Router，页面组件默认是 Server Component
- 需要客户端交互的组件需添加 `"use client"` 指令
- Tailwind CSS 4 使用新的配置方式，通过 CSS 文件配置
- shadcn/ui 组件使用 Radix UI 作为基础，提供完整的无障碍支持
