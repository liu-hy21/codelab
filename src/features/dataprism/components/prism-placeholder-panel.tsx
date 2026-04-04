"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type PrismPlaceholderPanelProps = {
  title: string
  description: string
}

export const PrismPlaceholderPanel = ({
  title,
  description,
}: PrismPlaceholderPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">功能开发中…</p>
      </CardContent>
    </Card>
  )
}
