"""
疗愈纯音乐 UI 预设 —— 改数值/文案优先改这个文件。
"""

from __future__ import annotations

# ── 模型与启动 ──────────────────────────────────────────────
DEFAULT_CONFIG_PATH = "acestep-v15-xl-sft"
DEFAULT_LANGUAGE = "zh"

# 仅保留纯音乐生成相关模式（隐藏 Remix / Repaint 等）
GENERATION_MODES = ["Simple", "Custom"]

# ── 生成默认参数 ────────────────────────────────────────────
DEFAULT_INSTRUMENTAL = True
DEFAULT_BPM = 65
DEFAULT_BPM_AUTO = False
DEFAULT_DURATION_SECONDS = 240.0  # 4 分钟
DEFAULT_DURATION_AUTO = False
DEFAULT_BATCH_SIZE = 1
DEFAULT_KEY_SCALE = "D minor"
DEFAULT_TIME_SIGNATURE = "4"

# 正向 / 负向提示词模板（Custom 模式 caption 默认值）
POSITIVE_PROMPT_TEMPLATE = (
    "meditation, healing, sleep aid, Chinese traditional instrumental, "
    "guqin, xiao, pipa, soft ambient, slow tempo, warm reverb, "
    "peaceful, no vocals, gentle dynamics, low saturation timbre"
)

NEGATIVE_PROMPT_TEMPLATE = (
    "vocals, singing, lyrics, speech, rap, drums, aggressive, loud, "
    "electronic dance, pop, rock, metal, distortion, sudden dynamics"
)

SIMPLE_QUERY_PLACEHOLDER = (
    "描述你想要的疗愈场景，例如：「雨夜窗前的古琴慢板，适合冥想入眠」"
)

# ── LoRA 训练默认超参 ───────────────────────────────────────
LORA_RANK = 48
LORA_ALPHA = 96
LORA_DROPOUT = 0.08
LORA_LEARNING_RATE = 1e-4
LORA_EPOCHS = 5
LORA_EPOCH_MIN = 1
LORA_EPOCH_STEP = 1
LORA_TRAIN_BATCH_SIZE = 1
LORA_GRADIENT_ACCUMULATION = 2

# ── 界面文案（也会写入 i18n 覆盖层）────────────────────────────
APP_TITLE = "静听 · 国风疗愈纯音乐工坊"
APP_SUBTITLE = "冥想助眠 · 舒缓器乐生成 · LoRA 风格微调"
TRAINING_HEADER = "🎋 疗愈纯音乐 LoRA 微调"

# 是否在训练区隐藏 LoKr 实验 Tab
HIDE_LOKR_TAB = True

# 是否在 Custom 模式隐藏歌词输入框
HIDE_LYRICS_INPUT = True

# 是否在 Simple 模式隐藏人声语言选择
HIDE_VOCAL_LANGUAGE = True
