import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">首页</h1>
        <p className="text-muted-foreground mt-2">
          欢迎使用 MyApp，这是一个带有左侧导航栏的示例页面。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>总用户数</CardTitle>
            <CardDescription>系统中的注册用户总数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>今日访问</CardTitle>
            <CardDescription>今日页面访问量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">856</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>活跃会话</CardTitle>
            <CardDescription>当前在线用户数</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">42</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button>主要操作</Button>
        <Button variant="outline">次要操作</Button>
      </div>
    </div>
  )
}
