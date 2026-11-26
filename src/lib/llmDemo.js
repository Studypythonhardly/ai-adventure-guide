// 第 1 关教学演示用的纯函数：温度采样 + 示意切词

/**
 * 带温度的 Softmax：把“原始打分”变成“被选中的概率（%）”。
 * 温度越低，分布越尖（高分词几乎必中）；温度越高，分布越平（冷门词也有机会）。
 */
export function softmaxWithTemperature(scores, temperature) {
  const t = Math.max(0.1, Number(temperature) || 1)
  const scaled = scores.map((s) => s / t)
  const max = Math.max(...scaled) // 减去最大值，防止 exp 溢出
  const exps = scaled.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => (e / sum) * 100)
}

/** 按概率（%）抽取一个下标；rand 可注入，方便测试 */
export function sampleIndex(probs, rand = Math.random) {
  const r = rand() * 100
  let acc = 0
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i]
    if (r < acc) return i
  }
  return probs.length - 1
}

/**
 * 教学用“示意”切词器：中文 1~2 字一块、英文最多 6 个字母一块、数字一块、标点/emoji 一块。
 * ⚠️ 真实模型使用 BPE 等分词算法，每家切法都不一样，这里只用来建立直觉。
 */
export function simulateTokenize(text) {
  if (!text) return []
  const matches = text.match(/[a-zA-Z]{1,6}|[0-9]+|[\u4e00-\u9fa5]{1,2}|[^\s]/gu)
  return matches || []
}
