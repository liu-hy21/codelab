/**
 * 将接口返回的 ISO 日期时间或日期字符串规范为展示/表单用的 yyyy-MM-dd。
 */
export const formatBirthdayForDisplay = (
  value: string | null | undefined
): string => {
  if (value == null || String(value).trim() === "") return ""
  const trimmed = String(value).trim()
  if (trimmed.includes("T")) {
    const part = trimmed.split("T")[0] ?? ""
    if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return trimmed
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
