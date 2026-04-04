"use client"

import { useCallback, useId, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { CUNXU_TABS, isLifeTipCategory } from "../constants"
import type { LifeTipCategory } from "../types"
import { TipScenePanel } from "./tip-scene-panel"

const DEFAULT_CATEGORY: LifeTipCategory = "HEALTH"

export const CunxuView = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tabListId = useId()

  const activeCategory = useMemo(() => {
    const c = searchParams.get("category")
    return isLifeTipCategory(c) ? c : DEFAULT_CATEGORY
  }, [searchParams])

  const setCategory = useCallback(
    (key: LifeTipCategory) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("category", key)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="p-8 pb-12">
      <header className="mb-8 space-y-2 text-pretty">
        <h1 className="text-3xl font-bold tracking-tight">存序</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          生活技巧与注意点库。按场景分栏保存，遇事不慌。
        </p>
      </header>

      <div className="border-border mb-6 border-b overflow-x-auto">
        <div
          id={tabListId}
          role="tablist"
          aria-label="存序生活场景"
          className="flex min-w-max gap-1 pb-px"
        >
          {CUNXU_TABS.map((tab) => {
            const selected = activeCategory === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={`${tabListId}-${tab.key}`}
                aria-selected={selected}
                aria-controls={`${tabListId}-${tab.key}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setCategory(tab.key)}
                className={cn(
                  "touch-manipulation shrink-0 rounded-t-md px-3 py-3 text-sm font-medium transition-colors sm:px-4",
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

      {CUNXU_TABS.map((tab) =>
        activeCategory === tab.key ? (
          <div
            key={tab.key}
            role="tabpanel"
            id={`${tabListId}-${tab.key}-panel`}
            aria-labelledby={`${tabListId}-${tab.key}`}
          >
            <TipScenePanel category={tab.key} />
          </div>
        ) : null
      )}
    </div>
  )
}
