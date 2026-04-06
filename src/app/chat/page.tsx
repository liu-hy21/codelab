"use client"

import { useId, useState } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatingChatPanel } from "@/features/dating/components/dating-chat-panel"
import { DatingTargetsPanel } from "@/features/dating/components/dating-targets-panel"
import { TalkWisdomPanel } from "@/features/dating/components/talk-wisdom-panel"
import type { DatingTargetVO } from "@/features/dating/types"

const TABS = ["人物数据", "AI决策", "交流智慧", "聊天"] as const

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("人物数据")
  const [chatTarget, setChatTarget] = useState<DatingTargetVO | null>(null)
  const tabListId = useId()

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">晤言</h1>
        <p className="text-muted-foreground mt-2">
          智能对话与决策系统
        </p>
      </div>

      <div className="border-b border-border">
        <div
          id={tabListId}
          role="tablist"
          aria-label="晤言功能分区"
          className="flex space-x-1"
        >
          {TABS.map((tab) => {
            const selected = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`${tabListId}-${tab}`}
                aria-selected={selected}
                aria-controls={`${tabListId}-${tab}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors rounded-t-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selected
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === "人物数据" ? (
          <div
            role="tabpanel"
            id={`${tabListId}-人物数据-panel`}
            aria-labelledby={`${tabListId}-人物数据`}
          >
            <DatingTargetsPanel
              onOpenChatEntry={(target) => {
                setChatTarget(target)
                setActiveTab("聊天")
              }}
            />
          </div>
        ) : null}

        {activeTab === "AI决策" ? (
          <div
            role="tabpanel"
            id={`${tabListId}-AI决策-panel`}
            aria-labelledby={`${tabListId}-AI决策`}
          >
            <Card>
              <CardHeader>
                <CardTitle>AI 决策系统</CardTitle>
                <CardDescription>基于人工智能的决策支持</CardDescription>
              </CardHeader>
              <CardContent>
                <p>AI决策系统正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {activeTab === "交流智慧" ? (
          <div
            role="tabpanel"
            id={`${tabListId}-交流智慧-panel`}
            aria-labelledby={`${tabListId}-交流智慧`}
          >
            <TalkWisdomPanel />
          </div>
        ) : null}

        {activeTab === "聊天" ? (
          <div
            role="tabpanel"
            id={`${tabListId}-聊天-panel`}
            aria-labelledby={`${tabListId}-聊天`}
          >
            <DatingChatPanel
              target={chatTarget}
              onSaved={(updatedTarget) => {
                setChatTarget(updatedTarget)
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
