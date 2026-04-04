import type { PositionInstrumentRow } from "../types"
import { listMockInstruments } from "./mock-chart-series"
import { pickInstrumentTags } from "./mock-metrics"

export const getMockPositionRows = (): PositionInstrumentRow[] => {
  const list = listMockInstruments()
  return list.map((ins, i) => {
    const seed = i + ins.symbol.length
    const tags = pickInstrumentTags(ins.market, seed)
    const hasPosition = i % 3 !== 0

    if (!hasPosition) {
      return {
        id: ins.id,
        symbol: ins.symbol,
        name: ins.name,
        market: ins.market,
        tags,
        quantity: null,
        marketValue: null,
        avgCost: null,
        unrealizedPnlPct: null,
        longTermWatch: i % 4 === 0,
      }
    }

    const quantity =
      ins.market === "CN"
        ? Math.round((800 + i * 120) * 100) / 100
        : Math.round((15 + i * 2.3 + seed * 0.01) * 100) / 100

    const avgCost =
      ins.market === "CN"
        ? Math.round((1.05 + i * 0.08) * 1000) / 1000
        : Math.round((80 + i * 12 + seed) * 100) / 100

    const move = 1 + (Math.sin(seed) * 0.06 + (i % 5 - 2) * 0.015)
    const markPx = Math.round(avgCost * move * 10000) / 10000
    const marketValue = Math.round(quantity * markPx * 100) / 100
    const unrealizedPnlPct =
      Math.round(((markPx - avgCost) / avgCost) * 10000) / 100

    return {
      id: ins.id,
      symbol: ins.symbol,
      name: ins.name,
      market: ins.market,
      tags,
      quantity,
      marketValue,
      avgCost,
      unrealizedPnlPct,
      longTermWatch: i % 4 === 0 || i % 4 === 1,
    }
  })
}
