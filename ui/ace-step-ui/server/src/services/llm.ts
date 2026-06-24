import { config } from '../config/index.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMResponse {
  text: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

const HEALING_CAPTION_SYSTEM_PROMPT = `你是一位专业的音乐疗愈标注专家，隶属于上海音乐学院人工智能音乐疗愈重点实验室。
你的任务是为疗愈音乐生成标准化的 caption（风格描述），用于 LoRA 微调训练数据集。

生成的 caption 必须遵循 ACE-Step 的标签格式，包含以下要素：
1. 音乐风格/流派标签（如 ambient, new age, classical, meditation music）
2. 情绪标签（如 peaceful, calming, serene, gentle, soothing）
3. 乐器描述（如 piano, strings, guzheng, xiao, nature sounds）
4. 疗愈场景（如 sleep aid, anxiety relief, meditation, pain management）
5. 节奏/氛围描述（如 slow tempo, flowing rhythm, minimalist arrangement）

输出格式要求：
- 纯英文标签，用逗号分隔
- 控制在 50-100 词之间
- 突出疗愈属性和临床应用场景
- 不要加引号或额外解释`;

const BATCH_CAPTION_SYSTEM_PROMPT = `你是一位专业的音乐疗愈标注专家。请根据提供的音频文件信息（文件名、已有标签、音乐参数），为每个样本生成标准化的 ACE-Step caption。

每个 caption 要求：
- 纯英文，逗号分隔的标签形式
- 50-100 词
- 包含：风格、情绪、乐器、疗愈场景、节奏描述
- 突出疗愈属性

请以 JSON 数组格式返回，每个元素包含 id 和 caption 字段。`;

async function callLLM(messages: ChatMessage[], temperature = 0.7): Promise<LLMResponse> {
  const url = `${config.llm.baseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.llm.apiKey}`,
    },
    body: JSON.stringify({
      model: config.llm.model,
      messages,
      max_tokens: config.llm.maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0]?.message?.content || '',
    usage: data.usage,
  };
}

export async function checkLLMHealth(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    const response = await fetch(`${config.llm.baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${config.llm.apiKey}` },
    });

    if (!response.ok) {
      return { available: false, model: config.llm.model, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    const models = data.data?.map((m: { id: string }) => m.id) || [];
    return { available: true, model: models[0] || config.llm.model };
  } catch (error) {
    return {
      available: false,
      model: config.llm.model,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

export async function generateCaption(params: {
  filename: string;
  emotionTags?: string[];
  instrumentTags?: string[];
  bpm?: number;
  keyScale?: string;
  timeSignature?: string;
  scene?: string;
  existingCaption?: string;
}): Promise<string> {
  const contextParts: string[] = [];

  if (params.filename) contextParts.push(`文件名: ${params.filename}`);
  if (params.emotionTags?.length) contextParts.push(`情绪标签: ${params.emotionTags.join(', ')}`);
  if (params.instrumentTags?.length) contextParts.push(`乐器: ${params.instrumentTags.join(', ')}`);
  if (params.bpm && params.bpm > 0) contextParts.push(`BPM: ${params.bpm}`);
  if (params.keyScale) contextParts.push(`调式: ${params.keyScale}`);
  if (params.timeSignature) contextParts.push(`拍号: ${params.timeSignature}`);
  if (params.scene) contextParts.push(`场景: ${params.scene}`);
  if (params.existingCaption) contextParts.push(`已有描述: ${params.existingCaption}`);

  const userPrompt = contextParts.length > 0
    ? `请根据以下音频信息生成疗愈音乐 caption:\n${contextParts.join('\n')}`
    : '请生成一段通用的疗愈音乐 caption，适合助眠/冥想场景。';

  const result = await callLLM([
    { role: 'system', content: HEALING_CAPTION_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);

  return result.text.trim();
}

export async function generateBatchCaptions(samples: Array<{
  id: string;
  filename: string;
  emotionTags?: string[];
  instrumentTags?: string[];
  bpm?: number;
  keyScale?: string;
  scene?: string;
}>): Promise<Array<{ id: string; caption: string }>> {
  const sampleDescriptions = samples.map((s, i) => {
    const parts = [`${i + 1}. id="${s.id}", 文件="${s.filename}"`];
    if (s.emotionTags?.length) parts.push(`情绪=${s.emotionTags.join(',')}`);
    if (s.instrumentTags?.length) parts.push(`乐器=${s.instrumentTags.join(',')}`);
    if (s.bpm) parts.push(`BPM=${s.bpm}`);
    if (s.keyScale) parts.push(`调式=${s.keyScale}`);
    if (s.scene) parts.push(`场景=${s.scene}`);
    return parts.join(', ');
  });

  const userPrompt = `请为以下 ${samples.length} 个音频样本生成 caption:\n\n${sampleDescriptions.join('\n')}\n\n请返回 JSON 数组格式: [{"id": "...", "caption": "..."}]`;

  const result = await callLLM([
    { role: 'system', content: BATCH_CAPTION_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ], 0.6);

  try {
    const jsonMatch = result.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    return JSON.parse(jsonMatch[0]);
  } catch {
    return samples.map(s => ({ id: s.id, caption: result.text }));
  }
}

export async function chatWithLLM(
  messages: ChatMessage[],
  temperature = 0.7,
): Promise<string> {
  const result = await callLLM(messages, temperature);
  return result.text;
}
