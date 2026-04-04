import { Suspense } from "react"
import { CunxuView } from "@/features/cunxu"

const CunxuFallback = () => (
  <div
    className="text-muted-foreground p-8 text-sm"
    role="status"
    aria-live="polite"
  >
    加载中…
  </div>
)

export default function SequencePage() {
  return (
    <Suspense fallback={<CunxuFallback />}>
      <CunxuView />
    </Suspense>
  )
}
