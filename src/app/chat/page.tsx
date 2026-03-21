"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("人物数据")

  const tabs = ["人物数据", "AI决策", "理念知识库"]

  // 人物数据假数据
  const persons = [
    {
      id: 1,
      name: "张三",
      age: 30,
      gender: "男",
      position: "工程师",
      department: "技术部",
      email: "zhangsan@example.com"
    },
    {
      id: 2,
      name: "李四",
      age: 28,
      gender: "女",
      position: "产品经理",
      department: "产品部",
      email: "lisi@example.com"
    },
    {
      id: 3,
      name: "王五",
      age: 35,
      gender: "男",
      position: "设计师",
      department: "设计部",
      email: "wangwu@example.com"
    },
    {
      id: 4,
      name: "赵六",
      age: 25,
      gender: "女",
      position: "运营",
      department: "运营部",
      email: "zhaoliu@example.com"
    },
    {
      id: 5,
      name: "钱七",
      age: 32,
      gender: "男",
      position: "销售",
      department: "销售部",
      email: "qianqi@example.com"
    }
  ]

  // 筛选状态
  const [filters, setFilters] = useState({
    name: "",
    department: "all"
  })

  return (
    <div className="p-8 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">晤言</h1>
        <p className="text-muted-foreground mt-2">
          智能对话与决策系统
        </p>
      </div>

      {/* 页面导航栏 */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {activeTab === "人物数据" && (
          <div className="space-y-4">
            {/* 筛选和操作栏 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 w-full sm:w-64">
                  <label className="text-sm font-medium">姓名</label>
                  <Input
                    placeholder="输入姓名"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-64">
                  <label className="text-sm font-medium">部门</label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ ...filters, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="技术部">技术部</SelectItem>
                      <SelectItem value="产品部">产品部</SelectItem>
                      <SelectItem value="设计部">设计部</SelectItem>
                      <SelectItem value="运营部">运营部</SelectItem>
                      <SelectItem value="销售部">销售部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>创建人物</Button>
            </div>

            {/* 人物列表 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>人物列表</CardTitle>
                <CardDescription>共 {persons.length} 条记录</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>年龄</TableHead>
                      <TableHead>性别</TableHead>
                      <TableHead>职位</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {persons.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell>{person.name}</TableCell>
                        <TableCell>{person.age}</TableCell>
                        <TableCell>{person.gender}</TableCell>
                        <TableCell>{person.position}</TableCell>
                        <TableCell>{person.department}</TableCell>
                        <TableCell>{person.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">详情</Button>
                            <Button size="sm" variant="outline">编辑</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "AI决策" && (
          <Card>
            <CardHeader>
              <CardTitle>AI 决策系统</CardTitle>
              <CardDescription>基于人工智能的决策支持</CardDescription>
            </CardHeader>
            <CardContent>
              <p>AI决策系统正在开发中...</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "理念知识库" && (
          <Card>
            <CardHeader>
              <CardTitle>理念知识库</CardTitle>
              <CardDescription>存储和管理理念相关知识</CardDescription>
            </CardHeader>
            <CardContent>
              <p>理念知识库正在开发中...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
