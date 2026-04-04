"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CHART_RANGE_OPTIONS } from "../constants"
import type { ChartRange } from "../types"

type ChartRangeSelectProps = {
  value: ChartRange
  onChange: (value: ChartRange) => void
  id?: string
}

export const ChartRangeSelect = ({
  value,
  onChange,
  id,
}: ChartRangeSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as ChartRange)}
    >
      <SelectTrigger id={id} className="w-[200px] touch-manipulation">
        <SelectValue placeholder="选择时间范围…" />
      </SelectTrigger>
      <SelectContent className="overscroll-y-contain">
        {CHART_RANGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
