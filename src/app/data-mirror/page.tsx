import { Suspense } from "react"
import { DataPrismView } from "@/features/dataprism"

const DataPrismFallback = () => (
  <div
    className="text-muted-foreground p-8 text-sm"
    role="status"
    aria-live="polite"
  >
    加载中…
  </div>
)

export default function DataMirrorPage() {
  return (
    <Suspense fallback={<DataPrismFallback />}>
      <DataPrismView />
    </Suspense>
  )
}
