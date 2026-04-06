# 数据棱镜 · 交易接口说明

面向前端的 HTTP 约定如下。后端控制器为 `TradeController`，路由前缀 **`/trade`**（含交易智慧语录、标的配置两类能力）。应用已配置 **`server.servlet.context-path: /codelab`**，下列路径均需加此前缀。

**Base URL 示例**：`http://<主机>:9001/codelab`

**Content-Type**：`POST` 接口使用 `application/json`。

---

## 数据模型说明

### 库表 `trade_wisdom`（便于对照）

| 列 | 说明 |
|----|------|
| id | 主键，自增 |
| content | 语录正文（必填） |
| author | 作者，默认空字符串 |
| tag | 标签，默认空字符串（可用于分类、检索） |

### 与代码对应关系

| 概念 | 类名 |
|------|------|
| 表映射 | `TradeWisdomDO` |
| 列表/详情返回 | `TradeWisdomVO` |
| 新增请求 | `TradeWisdomAddRequest` |
| 编辑请求 | `TradeWisdomUpdateRequest` |

### 库表 `trade_target`（标的配置）

| 列 | 说明 |
|----|------|
| id | 主键，自增 |
| code | 标的代号/代码 |
| cn_name | 标的中文名 |
| market | 所属市场（如：沪深、港股、美股、期货） |

### 与代码对应关系（标的）

| 概念 | 类名 |
|------|------|
| 表映射 | `TradeTargetDO` |
| 列表/详情返回 | `TradeTargetVO` |
| 列表查询（筛选） | `TradeTargetQueryRequest` |
| 新增请求 | `TradeTargetAddRequest` |
| 编辑请求 | `TradeTargetUpdateRequest` |

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

**失败示例**（参数校验，如 `@Valid` 不通过）：

```json
{
  "success": false,
  "code": 400,
  "msg": "内容不能为空",
  "data": null
}
```

**业务错误**（如记录不存在）：`IllegalArgumentException` 由全局异常处理为 `code: 400`，`msg` 为具体中文提示（如 `记录不存在`）。

---

## 1. 获取交易智慧语录列表

- **方法**：`GET`
- **路径**：`/trade/getTradeWisdomList`
- **完整路径**：`/codelab/trade/getTradeWisdomList`
- **请求参数**：无
- **说明**：查询当前表内全部语录，顺序以数据库默认/主键为准（未做自定义排序）。

**响应 `data` 类型**：`TradeWisdomVO[]`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 主键 |
| content | string | 内容 |
| author | string | 作者 |
| tag | string | 标签 |

**响应示例**：

```json
{
  "success": true,
  "code": 200,
  "msg": "OK",
  "data": [
    {
      "id": 1,
      "content": "截断亏损，让利润奔跑。",
      "author": "佚名",
      "tag": "心态"
    }
  ]
}
```

---

## 2. 新增交易智慧语录

- **方法**：`POST`
- **路径**：`/trade/add`
- **完整路径**：`/codelab/trade/add`
- **请求体**：`TradeWisdomAddRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | **是** | 内容；空串会触发校验失败（`内容不能为空`） |
| author | string | 否 | 作者 |
| tag | string | 否 | 标签 |

**请求示例**：

```json
{
  "content": "计划你的交易，交易你的计划。",
  "author": "",
  "tag": "纪律"
}
```

**响应 `data` 类型**：`TradeWisdomVO`（含数据库生成的主键 `id`）

**响应示例**：

```json
{
  "success": true,
  "code": 200,
  "msg": "OK",
  "data": {
    "id": 10,
    "content": "计划你的交易，交易你的计划。",
    "author": "",
    "tag": "纪律"
  }
}
```

---

## 3. 编辑交易智慧语录

- **方法**：`POST`
- **路径**：`/trade/update`
- **完整路径**：`/codelab/trade/update`
- **请求体**：`TradeWisdomUpdateRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | **是** | 主键；缺失时 `msg` 多为 `id不能为空` |
| content | string | **是** | 内容 |
| author | string | 否 | 作者 |
| tag | string | 否 | 标签 |

**业务错误**：当 `id` 在库中不存在时，`success` 为 `false`，`code` 为 `400`，`msg` 为 `记录不存在`。

**请求示例**：

```json
{
  "id": 10,
  "content": "计划你的交易，交易你的计划。（修订版）",
  "author": "笔记",
  "tag": "纪律"
}
```

**响应 `data` 类型**：`TradeWisdomVO`（更新后的完整记录）

---

## 4. 标的配置列表（带筛选）

- **方法**：`POST`
- **路径**：`/trade/target/query`
- **完整路径**：`/codelab/trade/target/query`
- **请求体**：`TradeTargetQueryRequest`（**所有字段可选**；均为空则返回全部记录）

| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 标的代码，**模糊**匹配（`LIKE`） |
| cnName | string | 中文名，**模糊**匹配（`LIKE`） |
| market | string | 所属市场，**精确**匹配（`=`） |

**说明**：结果按主键 `id` **降序**排列。

**请求示例**（按市场筛选）：

```json
{
  "code": "",
  "cnName": "",
  "market": "沪深"
}
```

**请求示例**（无条件拉全量，传空对象即可）：

```json
{}
```

**响应 `data` 类型**：`TradeTargetVO[]`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 主键 |
| code | string | 标的代码 |
| cnName | string | 中文名 |
| market | string | 所属市场 |

---

## 5. 新增标的配置

- **方法**：`POST`
- **路径**：`/trade/target/add`
- **完整路径**：`/codelab/trade/target/add`
- **请求体**：`TradeTargetAddRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | **是** | 标的代号/代码 |
| cnName | string | **是** | 标的中文名 |
| market | string | **是** | 所属市场 |

**请求示例**：

```json
{
  "code": "600519",
  "cnName": "贵州茅台",
  "market": "沪深"
}
```

**响应 `data` 类型**：`TradeTargetVO`（含新生成的 `id`）

---

## 6. 编辑标的配置

- **方法**：`POST`
- **路径**：`/trade/target/update`
- **完整路径**：`/codelab/trade/target/update`
- **请求体**：`TradeTargetUpdateRequest`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | **是** | 主键 |
| code | string | **是** | 标的代号/代码 |
| cnName | string | **是** | 标的中文名 |
| market | string | **是** | 所属市场 |

**业务错误**：`id` 不存在时，`msg` 为 `记录不存在`。

---

## 前端调用备忘

### 交易智慧语录

| 接口 | Method | Path（相对 context-path） |
|------|--------|---------------------------|
| 列表 | GET | `/trade/getTradeWisdomList` |
| 新增 | POST | `/trade/add` |
| 编辑 | POST | `/trade/update` |

### 标的配置

| 接口 | Method | Path（相对 context-path） |
|------|--------|---------------------------|
| 列表（筛选） | POST | `/trade/target/query` |
| 新增 | POST | `/trade/target/add` |
| 编辑 | POST | `/trade/target/update` |

若项目已集成 Springfox Swagger，可在 **`/codelab/swagger-ui.html`**（以实际 `Docket` 配置为准）中查看 **「交易接口」** 分组。
