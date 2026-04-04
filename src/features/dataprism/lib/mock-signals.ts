export type MockSignal = {
  id: string
  type: string
  instrument: string
  occurredAt: string
  detail: string
}

export const MOCK_SIGNALS_LAST_3D: MockSignal[] = [
  {
    id: "s1",
    type: "纳指日跌幅触发",
    instrument: "QQQ",
    occurredAt: "2026-04-03T21:30:00-04:00",
    detail: "单日跌幅 ≥ 2%，可考虑 1000–2000 USD 分批买入（演示数据）",
  },
  {
    id: "s2",
    type: "个股深跌触发",
    instrument: "MU",
    occurredAt: "2026-04-02T16:00:00-04:00",
    detail: "单日跌幅 ≥ 6%，关注抄底纪律（演示数据）",
  },
  {
    id: "s3",
    type: "标普回撤预警",
    instrument: "SPY",
    occurredAt: "2026-04-01T16:00:00-04:00",
    detail: "距写死梭哈阈值仍有空间，持续观察（演示数据）",
  },
]
