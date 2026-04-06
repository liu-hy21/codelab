# 交友模块接口说明

面向前端的 HTTP 约定如下。应用已配置 **`server.servlet.context-path: /codelab`**，下列路径均需加此前缀。

**Base URL 示例**：`http://<主机>:9001/codelab`

**Content-Type**：`POST` 接口使用 `application/json`。

---

## 数据模型说明

### 库表 `dating_target`（便于对照）

| 列 | 说明 |
|----|------|
| id | 主键 |
| name | 姓名 |
| info | 详情 JSON 字符串（对应后端 `DatingTargetInfo`，由服务端用 Fastjson 序列化存储） |
| calculate_index | 计算指标 |
| link_score | 链接分数 |

### 详情对象 `info`（`DatingTargetInfo`）

- 列表与新增/编辑的**响应**里，`data` 中的 `info` 为**解析后的对象**（不是字符串）。
- **新增、编辑请求体**中只需传「业务录入字段」；**不要传**（传了也会被覆盖）：
  - `constellation`（星座）
  - `zodiac`（生肖）
  - `bodyFatRate`（体脂率）  
  以上三项由服务端根据生日、身高、体重**自动计算并写入** `info` JSON。

**计算规则摘要**（供产品/前端展示预期）：

- **生肖**：按公历**出生年**简化推算（未按农历立春切换）。
- **星座**：按公历**月、日**。
- **体脂率**：由身高（cm）、体重（kg）、周岁年龄（由生日推算）做 BMI 类估算；无有效生日或身高/体重≤0 时约为 `0`。结果保留一位小数，并限制在合理区间内。

**`birthday` 反序列化**：请求体由 Spring 默认 Jackson 解析，常见写法为 ISO 日期字符串（如 `"1998-05-01"`）或时间戳，以实际全局日期格式配置为准。

---

## 统一响应结构 `CommonResponse`

| 字段 | 类型 | 说明 |
|------|------|------|
| success | boolean | 是否成功 |
| code | number | 成功时为 `200`；失败时为业务/错误码 |
| msg | string | 提示信息 |
| data | any | 业务数据，失败时多为 `null` |

**成功示例**：

```json
{
  "success": true,
  "code": 200,
  "msg": "OK",
  "data": {}
}
```

**失败示例**（如参数校验、业务提示）：

```json
{
  "success": false,
  "code": 400,
  "msg": "id不能为空",
  "data": null
}
```

---

## 1. 获取交友目标列表

- **方法**：`GET`
- **路径**：`/dating/getDatingTargetList`
- **完整路径**：`/codelab/dating/getDatingTargetList`
- **请求参数**：无
- **说明**：查询全部记录，每条为 `DatingTargetVO`。

**响应 `data` 类型**：`DatingTargetVO[]`

**`DatingTargetVO` 字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 主键 |
| name | string | 姓名 |
| info | object \| null | 详情对象，库中 `info` 为空则为 `null` |
| chatRecord | string | 聊天记录 |
| linkScore | string | 链接分数 |

**`info` 对象字段**（`DatingTargetInfo`）：

| 字段 | 类型 | 说明 |
|------|------|------|
| birthday | string | 生日（序列化多为 `yyyy-MM-dd`） |
| constellation | string | 星座（服务端计算） |
| zodiac | string | 生肖（服务端计算） |
| hometown | string | 家乡 |
| currentCity | string | 现居 |
| height | number | 身高（cm） |
| weight | number | 体重（kg） |
| bodyFatRate | number | 体脂率 %（服务端估算） |
| undergraduateSchool | string | 本科学校 |
| graduateSchool | string | 硕士学校 |
| job | string | 职业 |
| income | number | 收入 |
| company | string | 公司 |
| phone | string | 手机号 |
| wechat | string | 微信 |
| linkWay | string | 链接方式 |
| strength | string | 强项 |
| weakness | string | 弱点 |
| loveView | string | 爱情观 |
| moneyView | string | 消费观 |
| valueView | string | 价值观 |

**响应示例**：

```json
{
  "success": true,
  "code": 200,
  "msg": "OK",
  "data": [
    {
      "id": 1,
      "name": "示例",
      "info": {
        "birthday": "1998-05-01",
        "constellation": "金牛",
        "zodiac": "虎",
        "hometown": "杭州",
        "currentCity": "上海",
        "height": 175,
        "weight": 70,
        "bodyFatRate": 18.5,
        "undergraduateSchool": null,
        "graduateSchool": null,
        "job": null,
        "income": 0,
        "company": null,
        "phone": null,
        "wechat": null,
        "linkWay": null,
        "strength": null,
        "weakness": null,
        "loveView": null,
        "moneyView": null,
        "valueView": null
      },
      "chatRecord": null,
      "linkScore": null
    }
  ]
}
```

---

## 2. 新增交友目标

- **方法**：`POST`
- **路径**：`/dating/add`
- **完整路径**：`/codelab/dating/add`
- **请求体**：`DatingTargetAddRequest`（**不含** `constellation` / `zodiac` / `bodyFatRate`）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 姓名 |
| birthday | string / number | 否 | 生日（见上文日期说明） |
| hometown | string | 否 | 家乡 |
| currentCity | string | 否 | 现居 |
| height | number | 否 | 身高 cm（用于体脂估算，≤0 则不估算） |
| weight | number | 否 | 体重 kg（用于体脂估算，≤0 则不估算） |
| undergraduateSchool | string | 否 | 本科学校 |
| graduateSchool | string | 否 | 硕士学校 |
| job | string | 否 | 职业 |
| income | number | 否 | 收入 |
| company | string | 否 | 公司 |
| phone | string | 否 | 手机号 |
| wechat | string | 否 | 微信 |
| linkWay | string | 否 | 链接方式 |
| strength | string | 否 | 强项 |
| weakness | string | 否 | 弱点 |
| loveView | string | 否 | 爱情观 |
| moneyView | string | 否 | 消费观 |
| valueView | string | 否 | 价值观 |

**请求示例**：

```json
{
  "name": "张三",
  "birthday": "1996-08-12",
  "hometown": "宁波",
  "currentCity": "杭州",
  "height": 178,
  "weight": 72,
  "undergraduateSchool": "某某大学",
  "graduateSchool": null,
  "job": "工程师",
  "income": 0,
  "company": null,
  "phone": null,
  "wechat": null,
  "linkWay": null,
  "strength": null,
  "weakness": null,
  "loveView": null,
  "moneyView": null,
  "valueView": null
}
```

**响应 `data` 类型**：`DatingTargetVO`（含新生成的 `id`，`info` 内已含服务端写入的星座、生肖、体脂率）

---

## 3. 编辑交友目标

- **方法**：`POST`
- **路径**：`/dating/update`
- **完整路径**：`/codelab/dating/update`
- **请求体**：`DatingTargetUpdateRequest` = `id`（必填）+ 与新增相同的业务字段（**同样不要传**星座/生肖/体脂率）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | **是** | 主键；缺失时 `code` 为 `400` |
| name | string | 否 | 姓名 |
| 其余字段 | — | 否 | 与 **新增** 请求体一致 |

**业务错误**：`id` 不存在时，`success` 为 `false`，`code` 为 `400`，`msg` 为 `记录不存在`。

**说明**：每次编辑会用当前请求体**整体重建** `info`（再计算星座、生肖、体脂率），请按业务需要传全量或接受未传字段的默认值（数值型未传多为 `0`）。

**请求示例**：

```json
{
  "id": 10,
  "name": "张三（已改）",
  "birthday": "1996-08-12",
  "hometown": "宁波",
  "currentCity": "上海",
  "height": 178,
  "weight": 70,
  "undergraduateSchool": "某某大学",
  "graduateSchool": null,
  "job": "工程师",
  "income": 0,
  "company": null,
  "phone": null,
  "wechat": null,
  "linkWay": null,
  "strength": null,
  "weakness": null,
  "loveView": null,
  "moneyView": null,
  "valueView": null
}
```

**响应 `data` 类型**：`DatingTargetVO`（更新后的记录）

---

## 前端调用备忘

| 接口 | Method | Path（相对 context-path） |
|------|--------|---------------------------|
| 列表 | GET | `/dating/getDatingTargetList` |
| 新增 | POST | `/dating/add` |
| 编辑 | POST | `/dating/update` |
