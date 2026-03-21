import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function VisionPage() {
  // AI 圈子新闻假数据
  const aiNews = [
    {
      id: 1,
      title: "OpenAI 发布新一代多模态 Agent 系统",
      description: "新系统能够同时处理文本、图像、音频和视频，实现更智能的人机交互。",
      source: "AI Research",
      time: "2小时前",
      category: "agent"
    },
    {
      id: 2,
      title: "Meta 开源新的大型语言模型 Llama 4",
      description: "Llama 4 在多项基准测试中超过 GPT-4，完全免费商用。",
      source: "Meta AI",
      time: "5小时前",
      category: "开源"
    },
    {
      id: 3,
      title: "Google DeepMind 突破多模态理解极限",
      description: "新模型能够理解复杂的视觉场景并生成准确的描述。",
      source: "DeepMind Blog",
      time: "1天前",
      category: "多模态"
    },
    {
      id: 4,
      title: "特斯拉 AI 代码泄露事件调查",
      description: "疑似内部员工泄露了自动驾驶系统的核心代码。",
      source: "TechCrunch",
      time: "2天前",
      category: "代码泄露"
    },
    {
      id: 5,
      title: "Anthropic 推出 Claude 3.5 Sonnet",
      description: "新模型在推理和创造力方面有显著提升。",
      source: "Anthropic",
      time: "3天前",
      category: "重大新闻"
    }
  ]

  // 交易市场新闻假数据
  const marketNews = [
    {
      id: 1,
      title: "美联储暗示6月可能降息",
      description: "美联储主席鲍威尔表示通胀数据符合预期，为降息创造条件。",
      source: "Bloomberg",
      time: "1小时前",
      category: "美联储"
    },
    {
      id: 2,
      title: "大型科技股集体上涨",
      description: "AI概念股领涨，纳斯达克指数创历史新高。",
      source: "CNBC",
      time: "3小时前",
      category: "美股"
    },
    {
      id: 3,
      title: "石油价格因中东局势紧张上涨",
      description: "地缘政治风险加剧，布伦特原油突破85美元/桶。",
      source: "Reuters",
      time: "4小时前",
      category: "石油"
    },
    {
      id: 4,
      title: "黄金价格创6个月新高",
      description: "避险需求增加，金价突破2100美元/盎司。",
      source: "Financial Times",
      time: "6小时前",
      category: "黄金"
    },
    {
      id: 5,
      title: "加密货币市场大幅波动",
      description: "比特币价格在24小时内上涨10%，突破65000美元。",
      source: "CoinDesk",
      time: "1天前",
      category: "币"
    }
  ]

  // 分类颜色映射
  const categoryColors = {
    agent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "多模态": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "代码泄露": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "开源": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "重大新闻": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "美联储": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "石油": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "黄金": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "币": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "美股": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "机构操作": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">智观</h1>
        <p className="text-muted-foreground mt-2">
          了解最新的AI动态和市场信息
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI 圈子新闻 */}
        <div>
          <Card className="overflow-hidden rounded-2xl border border-border">
            <CardHeader className="bg-muted/50 border-b border-border">
              <CardTitle className="text-xl">AI 圈子新闻</CardTitle>
              <CardDescription>最新的人工智能动态</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {aiNews.map((news) => (
                  <div key={news.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryColors[news.category as keyof typeof categoryColors]}>
                            {news.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {news.time}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {news.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="https://ui.shadcn.com/avatar.png" />
                            <AvatarFallback>{news.source.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{news.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 交易市场新闻 */}
        <div>
          <Card className="overflow-hidden rounded-2xl border border-border">
            <CardHeader className="bg-muted/50 border-b border-border">
              <CardTitle className="text-xl">交易市场新闻</CardTitle>
              <CardDescription>最新的金融市场动态</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {marketNews.map((news) => (
                  <div key={news.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryColors[news.category as keyof typeof categoryColors]}>
                            {news.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {news.time}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-2">
                          {news.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {news.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="https://ui.shadcn.com/avatar.png" />
                            <AvatarFallback>{news.source.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{news.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
