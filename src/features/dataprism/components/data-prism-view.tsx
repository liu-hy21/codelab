"use client"

import { useCallback, useId, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { isChartRange, isPrismTabKey, PRISM_TABS } from "../constants"
import type { ChartRange, PrismTabKey } from "../types"
import { MetricsBoardPanel } from "./metrics-board-panel"
import { PositionsBoardPanel } from "./positions-board-panel"
import { PrismSignalBell } from "./prism-signal-bell"
import { TradeTargetPanel } from "./trade-target-panel"
import { TradeWisdomPanel } from "./trade-wisdom-panel"
import { TrendBoardPanel } from "./trend-board-panel"

const DEFAULT_TAB: PrismTabKey = "trend"
const DEFAULT_RANGE: ChartRange = "1M"

export const DataPrismView = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabListId = useId()

  const activeTab = useMemo(() => {
    const t = searchParams.get("tab")
    return isPrismTabKey(t) ? t : DEFAULT_TAB
  }, [searchParams])

  const range = useMemo(() => {
    const r = searchParams.get("range")
    return isChartRange(r) ? r : DEFAULT_RANGE
  }, [searchParams])

  const replaceQuery = useCallback(
    (next: { tab?: PrismTabKey; range?: ChartRange }) => {
      const params = new URLSearchParams(searchParams.toString())
      const tab = next.tab ?? activeTab
      const rng = next.range ?? range
      params.set("tab", tab)
      params.set("range", rng)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [activeTab, pathname, range, router, searchParams]
  )

  const setTab = useCallback(
    (key: PrismTabKey) => {
      replaceQuery({ tab: key })
    },
    [replaceQuery]
  )

  const setRange = useCallback(
    (r: ChartRange) => {
      replaceQuery({ range: r })
    },
    [replaceQuery]
  )

  return (
    <div className="p-8 pb-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 text-pretty">
          <h1 className="text-3xl font-bold tracking-tight">数据棱镜</h1>
        </div>
        <PrismSignalBell />
      </header>

      <div className="border-border mb-6 border-b">
        <div
          id={tabListId}
          role="tablist"
          aria-label="数据棱镜功能分区"
          className="flex flex-wrap gap-1"
        >
          {PRISM_TABS.map((tab) => {
            const selected = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`${tabListId}-${tab.key}`}
                aria-selected={selected}
                aria-controls={`${tabListId}-${tab.key}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(tab.key)}
                className={cn(
                  "touch-manipulation rounded-t-md px-4 py-3 text-sm font-medium transition-colors",
                  "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  selected
                    ? "border-primary text-primary border-b-2"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === "trend" ? (
        <div
          role="tabpanel"
          id={`${tabListId}-trend-panel`}
          aria-labelledby={`${tabListId}-trend`}
          className="space-y-6"
        >
          <TrendBoardPanel range={range} onRangeChange={setRange} />
        </div>
      ) : null}

      {activeTab === "metrics" ? (
        <div
          role="tabpanel"
          id={`${tabListId}-metrics-panel`}
          aria-labelledby={`${tabListId}-metrics`}
        >
          <MetricsBoardPanel />
        </div>
      ) : null}

      {activeTab === "positions" ? (
        <div
          role="tabpanel"
          id={`${tabListId}-positions-panel`}
          aria-labelledby={`${tabListId}-positions`}
        >
          <PositionsBoardPanel />
        </div>
      ) : null}

      {activeTab === "wisdom" ? (
        <div
          role="tabpanel"
          id={`${tabListId}-wisdom-panel`}
          aria-labelledby={`${tabListId}-wisdom`}
        >
          <TradeWisdomPanel />
        </div>
      ) : null}

      {activeTab === "targets" ? (
        <div
          role="tabpanel"
          id={`${tabListId}-targets-panel`}
          aria-labelledby={`${tabListId}-targets`}
        >
          <TradeTargetPanel />
        </div>
      ) : null}
    </div>
  )
}
