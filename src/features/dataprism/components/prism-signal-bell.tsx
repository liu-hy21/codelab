"use client"

import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MOCK_SIGNALS_LAST_3D } from "../lib/mock-signals"

const timeFmt = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
})

export const PrismSignalBell = () => {
  const count = MOCK_SIGNALS_LAST_3D.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative touch-manipulation shrink-0"
          aria-label={`告警，近三日信号，共 ${count} 条`}
        >
          <BellIcon className="size-4" aria-hidden="true" />
          {count > 0 ? (
            <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 overscroll-y-contain sm:w-96"
      >
        <DropdownMenuLabel>近 3 日信号</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ul className="max-h-72 space-y-3 overflow-y-auto p-1" role="list">
          {MOCK_SIGNALS_LAST_3D.map((s) => (
            <li
              key={s.id}
              className="border-border/80 space-y-1 rounded-md border px-2 py-2"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{s.type}</span>
                <span className="text-muted-foreground tabular-nums text-xs">
                  {timeFmt.format(new Date(s.occurredAt))}
                </span>
              </div>
              <p className="text-muted-foreground text-xs tabular-nums">
                {s.instrument}
              </p>
              <p className="text-foreground/90 text-sm leading-snug break-words">
                {s.detail}
              </p>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
