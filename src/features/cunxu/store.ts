import { create } from "zustand"
import { buildInitialLifeTips } from "./lib/mock-life-tips"
import type { LifeTip } from "./types"

type CunxuState = {
  tips: LifeTip[]
  addTip: (
    input: Omit<LifeTip, "id" | "updatedAt">
  ) => void
  updateTip: (id: string, patch: Partial<Omit<LifeTip, "id">>) => void
  removeTip: (id: string) => void
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `tip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useCunxuStore = create<CunxuState>((set) => ({
  tips: buildInitialLifeTips(),
  addTip: (input) =>
    set((s) => ({
      tips: [
        ...s.tips,
        {
          ...input,
          id: newId(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateTip: (id, patch) =>
    set((s) => ({
      tips: s.tips.map((t) =>
        t.id === id
          ? { ...t, ...patch, updatedAt: new Date().toISOString() }
          : t
      ),
    })),
  removeTip: (id) =>
    set((s) => ({ tips: s.tips.filter((t) => t.id !== id) })),
}))
