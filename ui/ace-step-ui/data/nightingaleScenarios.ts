/**
 * Clinical music therapy scenarios and Chinese style tags for Nightingale.
 */

export interface ClinicalScenario {
  id: string;
  name: string;
  style: string;
  bpm: number;
  duration: number;
  key: string;
}

export const CLINICAL_SCENARIOS: ClinicalScenario[] = [
  {
    id: "sleep",
    name: "助眠",
    style: "Ambient, Soft Piano, Gentle Pads, Sleep Music",
    bpm: 50,
    duration: 300,
    key: "C major",
  },
  {
    id: "anxiety",
    name: "缓解焦虑",
    style: "Ambient, Nature Sounds, Gentle Strings, Calming",
    bpm: 60,
    duration: 180,
    key: "G major",
  },
  {
    id: "focus",
    name: "专注力",
    style: "Lo-fi, Minimal, Binaural Beats, Study Music",
    bpm: 72,
    duration: 240,
    key: "D major",
  },
  {
    id: "meditation",
    name: "冥想",
    style: "Tibetan Bowls, Drone, Ambient, Meditation",
    bpm: 40,
    duration: 600,
    key: "A minor",
  },
  {
    id: "pain",
    name: "疼痛管理",
    style: "Ambient, Warm Pads, Gentle Harp, Soothing",
    bpm: 55,
    duration: 180,
    key: "F major",
  },
  {
    id: "postop",
    name: "术后恢复",
    style: "Soft Orchestra, Nature Sounds, Gentle, Healing",
    bpm: 65,
    duration: 240,
    key: "Bb major",
  },
];

export const CHINESE_STYLE_TAGS: string[] = [
  "古筝",
  "琵琶",
  "二胡",
  "竹笛",
  "箫",
  "古琴",
  "中国风",
  "五声音阶",
  "民乐",
  "禅意",
];
