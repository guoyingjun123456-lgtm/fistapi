# 渠道配价工具 (pricing-config)

把各家官方"美元/百万 token"价目换算成 new-api 的倍率/固定价,合并写入 `options` 表,不覆盖其它模型。

## 目录
- `scripts/calc_pricing.py` — 解析价目表(`pricing/*.txt`),匹配渠道模型,算 ModelRatio / CompletionRatio / CacheRatio,合并输出。
- `scripts/test_ark.py` — 测 OpenAI 兼容 `chat/completions` 是否跑通(key 从环境变量 / `.env` 读,不入库)。
- `pricing/pricing.txt` — 文本/向量模型价目(Tab 分隔)。
- `pricing/image_prices.txt` — 图像模型按张价。
- `pricing/tts_prices.txt` — 语音合成按次价。

## 换算规则
new-api 锚点:倍率 1 = $2 / 百万 token;$1 = 500000 quota。
- `ModelRatio = 输入价(USD/M) / 2`
- `CompletionRatio = 输出价 / 输入价`
- `CacheRatio = 缓存命中输入价 / 输入价`
- 图像/视频/语音等无 token 的,走 `ModelPrice`(美元/次)。

## 用法
1. 从数据库导出渠道模型清单与当前各倍率 JSON。
2. 运行 `calc_pricing.py` 生成合并后的 JSON。
3. `UPDATE options` 写回,等约 60s 同步生效,真发一笔请求按消费日志对账。

## 注意
- 单位:火山 BytePlus、阿里百炼国际站都是 USD/百万 token;阿里国内站常是 ¥/千 token,换算系数不同。
- 视频按秒计费,new-api 无"按秒"模式,只能用 `ModelPrice` 按次估或用 `param_override` 锁规格防薅。
