import type { MarketCode } from "../types"

const CURRENCY: Record<MarketCode, string> = {
  CN: "CNY",
  HK: "HKD",
  US: "USD",
}

const qtyFmt = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
})

const pctFmt = new Intl.NumberFormat("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
})

export const formatPositionQuantity = (n: number): string => qtyFmt.format(n)

export const formatPositionMoney = (market: MarketCode, n: number): string =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: CURRENCY[market],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

export const formatCostPerShare = (market: MarketCode, n: number): string => {
  if (market === "CN") {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(n)
  }
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: CURRENCY[market],
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export const formatUnrealizedPnlPct = (n: number): string =>
  `${pctFmt.format(n)}%`
