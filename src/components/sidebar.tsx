"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PenTool,
  MessageSquare,
  ListOrdered,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "首页",
    href: "/",
    icon: Home,
  },
  {
    title: "仪表盘",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "用户",
    href: "/users",
    icon: Users,
  },
  {
    title: "文档",
    href: "/documents",
    icon: FileText,
  },
  {
    title: "设置",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "智观",
    href: "/vision",
    icon: HelpCircle,
  },
  {
    title: "数据棱镜",
    href: "/data-mirror",
    icon: BarChart3,
  },
  {
    title: "万象创编",
    href: "/create",
    icon: PenTool,
  },
  {
    title: "晤言",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "存序",
    href: "/sequence",
    icon: ListOrdered,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col min-h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo 区域 */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground">
            半人马座
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
