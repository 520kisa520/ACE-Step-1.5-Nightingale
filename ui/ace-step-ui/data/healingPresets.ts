/**
 * 疗愈纯音乐 UI 预设（React 端）。
 *
 * 与 Gradio 版 `acestep/ui/gradio_healing/presets.py` 保持同一套疗愈默认值，
 * 改数值/文案优先改这个文件。组件通过 `HEALING_MODE` 开关在"疗愈模式"与
 * 原版模式之间切换默认行为。
 */

/** 是否启用疗愈模式（纯音乐、低饱和磨砂主题、隐藏人声/翻唱相关入口）。 */
export const HEALING_MODE = true;

/** 疗愈模式下的默认风格标签（替代随机曲风标签）。 */
export const HEALING_STYLE_TAGS: string[] = [
  "meditation",
  "healing",
  "sleep aid",
  "Chinese traditional instrumental",
  "guqin",
  "xiao",
  "pipa",
  "soft ambient",
  "slow tempo",
  "warm reverb",
  "peaceful",
  "low saturation timbre",
];

/** 疗愈模式默认纯器乐（无人声）。 */
export const DEFAULT_INSTRUMENTAL = true;

/** 默认 BPM（舒缓慢板）。 */
export const DEFAULT_BPM = 65;

/** 默认时长（秒），约 4 分钟。 */
export const DEFAULT_DURATION = 240;

/** 默认调式。 */
export const DEFAULT_KEY = "D minor";

/** 默认拍号（取值需匹配 CreatePanel 的 TIME_SIGNATURES）。 */
export const DEFAULT_TIME_SIGNATURE = "4";

/** 默认人声语言（疗愈模式为纯器乐，留空表示不指定）。 */
export const DEFAULT_VOCAL_LANGUAGE = "";

/** Custom 模式默认正向提示词 / 风格描述。 */
export const DEFAULT_STYLE =
  "meditation, healing, sleep aid, Chinese traditional instrumental, " +
  "guqin, xiao, pipa, soft ambient, slow tempo, warm reverb, " +
  "peaceful, no vocals, gentle dynamics, low saturation timbre";

/** Simple 模式默认场景描述。 */
export const DEFAULT_SONG_DESCRIPTION =
  "古琴与箫的舒缓国风纯音乐，慢板，温暖混响，适合冥想、放松与入眠";

/** 默认负向提示词。 */
export const DEFAULT_NEGATIVE_PROMPT =
  "vocals, singing, lyrics, speech, rap, drums, aggressive, loud, " +
  "electronic dance, pop, rock, metal, distortion, sudden dynamics";
