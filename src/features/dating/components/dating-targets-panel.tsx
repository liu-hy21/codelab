"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { addDatingTarget, updateDatingTarget } from "../api"
import { useDatingTargetList } from "../hooks/useDatingTargetList"
import {
  datingTargetFormSchema,
  datingTargetUpdateFormSchema,
  type DatingTargetFormInput,
  type DatingTargetFormValues,
  type DatingTargetUpdateFormInput,
} from "../schema"
import type { DatingTargetAddRequest, DatingTargetVO } from "../types"

const PAGE_SIZE = 10

const emptyFormValues = (): DatingTargetFormInput => ({
  name: "",
  birthday: "",
  hometown: "",
  currentCity: "",
  height: undefined,
  weight: undefined,
  undergraduateSchool: "",
  graduateSchool: "",
  job: "",
  income: undefined,
  company: "",
  phone: "",
  wechat: "",
  linkWay: "",
  strength: "",
  weakness: "",
  loveView: "",
  moneyView: "",
  valueView: "",
})

const voToUpdateValues = (vo: DatingTargetVO): DatingTargetUpdateFormInput => {
  const i = vo.info
  return {
    id: vo.id,
    name: vo.name ?? "",
    birthday: i?.birthday ?? "",
    hometown: i?.hometown ?? "",
    currentCity: i?.currentCity ?? "",
    height: i?.height ?? undefined,
    weight: i?.weight ?? undefined,
    undergraduateSchool: i?.undergraduateSchool ?? "",
    graduateSchool: i?.graduateSchool ?? "",
    job: i?.job ?? "",
    income: i?.income ?? undefined,
    company: i?.company ?? "",
    phone: i?.phone ?? "",
    wechat: i?.wechat ?? "",
    linkWay: i?.linkWay ?? "",
    strength: i?.strength ?? "",
    weakness: i?.weakness ?? "",
    loveView: i?.loveView ?? "",
    moneyView: i?.moneyView ?? "",
    valueView: i?.valueView ?? "",
  }
}

const toAddBody = (v: DatingTargetFormValues): DatingTargetAddRequest => {
  const body: DatingTargetAddRequest = {}
  if (v.name?.trim()) body.name = v.name.trim()
  if (v.birthday?.trim()) body.birthday = v.birthday.trim()
  if (v.hometown?.trim()) body.hometown = v.hometown.trim()
  if (v.currentCity?.trim()) body.currentCity = v.currentCity.trim()
  if (v.height !== undefined) body.height = v.height
  if (v.weight !== undefined) body.weight = v.weight
  if (v.undergraduateSchool?.trim())
    body.undergraduateSchool = v.undergraduateSchool.trim()
  if (v.graduateSchool?.trim()) body.graduateSchool = v.graduateSchool.trim()
  if (v.job?.trim()) body.job = v.job.trim()
  if (v.income !== undefined) body.income = v.income
  if (v.company?.trim()) body.company = v.company.trim()
  if (v.phone?.trim()) body.phone = v.phone.trim()
  if (v.wechat?.trim()) body.wechat = v.wechat.trim()
  if (v.linkWay?.trim()) body.linkWay = v.linkWay.trim()
  if (v.strength?.trim()) body.strength = v.strength.trim()
  if (v.weakness?.trim()) body.weakness = v.weakness.trim()
  if (v.loveView?.trim()) body.loveView = v.loveView.trim()
  if (v.moneyView?.trim()) body.moneyView = v.moneyView.trim()
  if (v.valueView?.trim()) body.valueView = v.valueView.trim()
  return body
}

const InfoRow = ({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) => (
  <div className="grid grid-cols-[6rem_1fr] gap-2 text-sm">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="break-words">
      {value === null || value === undefined || value === "" ? "—" : value}
    </dd>
  </div>
)

export const DatingTargetsPanel = () => {
  const { list, loading, error, refetch } = useDatingTargetList()
  const [nameFilter, setNameFilter] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [detailTarget, setDetailTarget] = useState<DatingTargetVO | null>(null)
  const [editTarget, setEditTarget] = useState<DatingTargetVO | null>(null)

  const cityOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of list) {
      const c = row.info?.currentCity?.trim()
      if (c) set.add(c)
    }
    return [...set].sort((a, b) => a.localeCompare(b, "zh-CN"))
  }, [list])

  const filtered = useMemo(() => {
    const q = nameFilter.trim().toLowerCase()
    return list.filter((row) => {
      const nameOk =
        !q || row.name.toLowerCase().includes(q)
      const city = row.info?.currentCity?.trim() ?? ""
      const cityOk =
        cityFilter === "all" || city === cityFilter
      return nameOk && cityOk
    })
  }, [list, nameFilter, cityFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, safePage])

  const createForm = useForm<DatingTargetFormInput>({
    resolver: zodResolver(datingTargetFormSchema),
    defaultValues: emptyFormValues(),
  })

  const editForm = useForm<DatingTargetUpdateFormInput>({
    resolver: zodResolver(datingTargetUpdateFormSchema),
    defaultValues: { id: 0, ...emptyFormValues() },
  })

  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)

  const openCreate = () => {
    createForm.reset(emptyFormValues())
    setCreateOpen(true)
  }

  const openEdit = (vo: DatingTargetVO) => {
    editForm.reset(voToUpdateValues(vo))
    setEditTarget(vo)
  }

  const onCreateSubmit = createForm.handleSubmit(async (values) => {
    setCreateSubmitting(true)
    try {
      const parsed = datingTargetFormSchema.parse(values)
      await addDatingTarget(toAddBody(parsed))
      setCreateOpen(false)
      await refetch()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "创建失败"
      createForm.setError("root", { message: msg })
    } finally {
      setCreateSubmitting(false)
    }
  })

  const onEditSubmit = editForm.handleSubmit(async (values) => {
    setEditSubmitting(true)
    try {
      const parsed = datingTargetUpdateFormSchema.parse(values)
      const { id, ...rest } = parsed
      await updateDatingTarget({ id, ...toAddBody(rest) })
      setEditTarget(null)
      await refetch()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "保存失败"
      editForm.setError("root", { message: msg })
    } finally {
      setEditSubmitting(false)
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:flex-1">
          <div className="flex flex-col gap-2 w-full sm:w-64">
            <label htmlFor="dating-filter-name" className="text-sm font-medium">
              姓名
            </label>
            <Input
              id="dating-filter-name"
              placeholder="输入姓名"
              value={nameFilter}
              onChange={(e) => {
                setNameFilter(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-64">
            <span id="dating-filter-city-label" className="text-sm font-medium">
              现居
            </span>
            <Select
              value={cityFilter}
              onValueChange={(value) => {
                setCityFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger aria-labelledby="dating-filter-city-label">
                <SelectValue placeholder="选择城市" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {cityOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="button" onClick={openCreate}>
          创建人物
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>人物列表</CardTitle>
          <CardDescription>
            共 {filtered.length} 条记录
            {filtered.length > PAGE_SIZE
              ? `，第 ${safePage} / ${totalPages} 页`
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>生日</TableHead>
                  <TableHead>星座</TableHead>
                  <TableHead>职业</TableHead>
                  <TableHead>现居</TableHead>
                  <TableHead>手机</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2Icon className="size-4 animate-spin" />
                        加载中…
                      </span>
                    </TableCell>
                  </TableRow>
                ) : pageSlice.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  pageSlice.map((row) => {
                    const i = row.info
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{i?.birthday ?? "—"}</TableCell>
                        <TableCell>{i?.constellation ?? "—"}</TableCell>
                        <TableCell>{i?.job ?? "—"}</TableCell>
                        <TableCell>{i?.currentCity ?? "—"}</TableCell>
                        <TableCell>{i?.phone ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2 flex-wrap">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setDetailTarget(row)}
                            >
                              详情
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(row)}
                            >
                              编辑
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && filtered.length > PAGE_SIZE ? (
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                每页 {PAGE_SIZE} 条
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  上一页
                </Button>
                <span className="tabular-nums">
                  {safePage} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  下一页
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>创建人物</DialogTitle>
            <DialogDescription>
              填写交友目标信息；星座、生肖、体脂率由服务端根据生日与身高体重计算。
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={onCreateSubmit} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>生日</FormLabel>
                    <FormControl>
                      <Input placeholder="如 1998-05-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>身高 (cm)</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="decimal"
                          placeholder="身高"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>体重 (kg)</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="decimal"
                          placeholder="体重"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={createForm.control}
                name="hometown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>家乡</FormLabel>
                    <FormControl>
                      <Input placeholder="家乡" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="currentCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>现居</FormLabel>
                    <FormControl>
                      <Input placeholder="现居城市" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职业</FormLabel>
                    <FormControl>
                      <Input placeholder="职业" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机</FormLabel>
                    <FormControl>
                      <Input placeholder="手机号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="wechat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>微信</FormLabel>
                    <FormControl>
                      <Input placeholder="微信号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {createForm.formState.errors.root ? (
                <p className="text-sm text-destructive">
                  {createForm.formState.errors.root.message}
                </p>
              ) : null}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit" disabled={createSubmitting}>
                  {createSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2Icon className="size-4 animate-spin" />
                      提交中
                    </span>
                  ) : (
                    "提交"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑人物</DialogTitle>
            <DialogDescription>
              修改后服务端会重新计算星座、生肖与体脂率。
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={onEditSubmit} className="space-y-4">
              <input type="hidden" {...editForm.register("id")} />
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>生日</FormLabel>
                    <FormControl>
                      <Input placeholder="如 1998-05-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>身高 (cm)</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="decimal"
                          placeholder="身高"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>体重 (kg)</FormLabel>
                      <FormControl>
                        <Input
                          inputMode="decimal"
                          placeholder="体重"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="hometown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>家乡</FormLabel>
                    <FormControl>
                      <Input placeholder="家乡" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="currentCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>现居</FormLabel>
                    <FormControl>
                      <Input placeholder="现居城市" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>职业</FormLabel>
                    <FormControl>
                      <Input placeholder="职业" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>手机</FormLabel>
                    <FormControl>
                      <Input placeholder="手机号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="wechat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>微信</FormLabel>
                    <FormControl>
                      <Input placeholder="微信号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {editForm.formState.errors.root ? (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.root.message}
                </p>
              ) : null}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTarget(null)}
                >
                  取消
                </Button>
                <Button type="submit" disabled={editSubmitting}>
                  {editSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2Icon className="size-4 animate-spin" />
                      保存中
                    </span>
                  ) : (
                    "保存"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!detailTarget}
        onOpenChange={(open) => {
          if (!open) setDetailTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>人物详情</DialogTitle>
            <DialogDescription>
              {detailTarget?.name ?? ""}
            </DialogDescription>
          </DialogHeader>
          {detailTarget ? (
            <dl className="space-y-2">
              <InfoRow label="ID" value={detailTarget.id} />
              <InfoRow label="姓名" value={detailTarget.name} />
              <InfoRow
                label="链接分"
                value={detailTarget.linkScore ?? "—"}
              />
              <InfoRow
                label="计算指标"
                value={detailTarget.calculateIndex ?? "—"}
              />
              <InfoRow
                label="生日"
                value={detailTarget.info?.birthday ?? undefined}
              />
              <InfoRow
                label="星座"
                value={detailTarget.info?.constellation ?? undefined}
              />
              <InfoRow
                label="生肖"
                value={detailTarget.info?.zodiac ?? undefined}
              />
              <InfoRow
                label="体脂率"
                value={
                  detailTarget.info?.bodyFatRate !== undefined &&
                  detailTarget.info?.bodyFatRate !== null
                    ? `${detailTarget.info.bodyFatRate}%`
                    : undefined
                }
              />
              <InfoRow
                label="家乡"
                value={detailTarget.info?.hometown ?? undefined}
              />
              <InfoRow
                label="现居"
                value={detailTarget.info?.currentCity ?? undefined}
              />
              <InfoRow
                label="身高"
                value={
                  detailTarget.info?.height !== undefined &&
                  detailTarget.info?.height !== null
                    ? `${detailTarget.info.height} cm`
                    : undefined
                }
              />
              <InfoRow
                label="体重"
                value={
                  detailTarget.info?.weight !== undefined &&
                  detailTarget.info?.weight !== null
                    ? `${detailTarget.info.weight} kg`
                    : undefined
                }
              />
              <InfoRow
                label="职业"
                value={detailTarget.info?.job ?? undefined}
              />
              <InfoRow
                label="手机"
                value={detailTarget.info?.phone ?? undefined}
              />
              <InfoRow
                label="微信"
                value={detailTarget.info?.wechat ?? undefined}
              />
            </dl>
          ) : null}
          <DialogFooter>
            <Button type="button" onClick={() => setDetailTarget(null)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
