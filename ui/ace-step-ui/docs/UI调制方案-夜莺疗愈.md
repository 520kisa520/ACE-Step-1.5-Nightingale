# 夜莺 · 视听疗愈 AI — UI 调制方案（V1.0）

> 依据《副本展架内容.docx》整理，面向 **ace-step-ui + ACE-Step 1.5 XL** 轻量化专用前端  
> 品牌：上海脑舒科技（SOOTHE）× 上海音乐学院 AI 音乐疗愈重点实验室  
> 模型引擎：夜莺大模型 / acestep-v15-xl-sft  
> 文档日期：2026年6月

---

## 一、项目背景与 UI 定位

### 1.1 展架核心信息摘要

| 维度 | 内容 |
|------|------|
| 产品名 | **夜莺** — 全球首个视听疗愈 AI 垂类大模型 |
| 品牌 | 脑舒科技 / SOOTHE |
| 闭环 | 监测 → 判定 → 疗愈 → 验证 |
| 技术亮点 | HRV 情绪解码、百万级疗愈语料、500+ 场景匹配、准确率 >92% |
| 合作方 | 上音 AI 音乐疗愈重点实验室（廖昌永/刘灏团队，AIME 科研团队） |
| 产品生态 | Soothe APP、VUE 眼镜、Studio 音响、Wearables 等（UI 为 **Studio/实验平台** 子集） |

### 1.2 UI 战略定位

**不做通用 AI 音乐生成器，做「夜莺疗愈音乐工坊」专用入口。**

```
用户路径（简化版闭环）：
  选择疗愈场景 → 调整参数（可选）→ 生成纯音乐 → 试听/入库 → LoRA 风格微调（进阶）
```

与展架叙事对齐：

- **判定**：场景标签 + BPM/时长预设（后续可接 HRV 接口）
- **疗愈**：国风/ambient 纯器乐生成
- **验证**：试听、收藏、导出（HRV 改善率展示为 P2）

---

## 二、品牌与视觉调制

### 2.1 命名与文案体系

| 位置 | 现版（ace-step-ui） | 调制目标 |
|------|---------------------|----------|
| 产品名 | ACE-Step UI / 静听工坊 | **夜莺 · 视听疗愈工坊** |
| 副标题 | 免费 AI 音乐 | **监测 · 判定 · 疗愈 · 验证 — 可量化身心健康 AI 闭环** |
| 欢迎页 | Welcome to ACE-Step UI | **欢迎使用夜莺视听疗愈 AI** |
| 侧边栏 Logo 文案 | aceStepUI | **夜莺 Nightingale** |
| 页脚/关于 | 无 | **脑舒科技 SOOTHE × 上音 AI 音乐疗愈重点实验室** |

### 2.2 色彩与气质（低饱和疗愈风）

| 元素 | 色值建议 | 语义 |
|------|----------|------|
| 主背景 | `#F4F1EC` / `#EBE6DF` | 米白、纸感、安静 |
| 主色 | `#7A9E8E` | 青绿，自然疗愈 |
| 辅色 | `#B8CFC4` | 淡青，呼吸感 |
| 强调 | `#5C7A6E` | 深青，按钮/选中 |
| 文字 | `#3D4540` / `#8A9490` | 深灰正文 / 浅灰说明 |
| 禁用高饱和 | 避免 `#FF00xx`、霓虹渐变 | 与 Spotify 原 UI 渐变区隔 |

**实施文件：**

- `index.html` / 全局 CSS 变量（新建 `src/styles/healing-theme.css`）
- `components/Sidebar.tsx`、`UsernameModal.tsx`（替换粉紫渐变为青绿渐变）
- `App.tsx` 默认 `theme: light`（疗愈场景优先浅色）

### 2.3 字体与图标

- 中文：`Noto Sans SC` / 系统苹方
- 英文标题：`Nightingale` 可用细字重 + 字间距
- 图标：少用「唱片/派对」语义，多用 **叶子、月亮、声波、呼吸** 类 lucide 图标

---

## 三、信息架构与功能裁剪

### 3.1 导航结构（调制后）

| 保留 | 隐藏/降级 | 说明 |
|------|-----------|------|
| **创作**（原 Create） | — | 主入口，改名为「疗愈生成」 |
| **音乐库**（Library） | — | 生成结果管理 |
| **训练**（Training） | — | LoRA 微调，改名为「风格训练」 |
| 搜索 | 可保留 | 仅搜本库 |
| 新闻 News | **隐藏** | 与展架/产品无关 |
| 视频生成 | **隐藏** | 非 MVP |
| Stem 分离 / 翻唱 / Remix | **隐藏** | 纯音乐专用 |
| 人声/歌词编辑 | **隐藏** | 默认纯器乐 |
| 社区/分享（若存在） | **P2** | 先做本地/内网 |

**实施文件：**

- `components/Sidebar.tsx` — 移除 News 入口
- `components/CreatePanel.tsx` — 条件渲染 `HEALING_MODE`
- `App.tsx` — 默认视图 `create`

### 3.2 创作页布局（三级 disclosure）

```
┌─────────────────────────────────────────────┐
│  夜莺 · 视听疗愈工坊                          │
│  脑舒科技 SOOTHE × 上音 AI 音乐疗愈实验室      │
├─────────────────────────────────────────────┤
│  [1] 疗愈场景（必选）                         │
│      临床 ten 标签 / 生活场景标签 / 国风器乐   │
├─────────────────────────────────────────────┤
│  [2] 场景描述（Simple）或 风格提示词（Custom） │
│      预设正向/负向模板                        │
├─────────────────────────────────────────────┤
│  [3] 乐曲参数（默认展开，数值已填）            │
│      时长 · BPM · 调性 · 拍号 · 纯器乐 ✓      │
├─────────────────────────────────────────────┤
│  [▸ 高级参数]  默认折叠                       │
│      Seed · Steps · LM · Batch 等            │
├─────────────────────────────────────────────┤
│            [ 生成疗愈音乐 ]                    │
└─────────────────────────────────────────────┘
```

---

## 四、场景化预设（对齐展架 500+ 场景）

### 4.1 十大临床场景 → UI 快捷标签

展架临床场景映射为创作页一级 Chip（点击即填充描述 + 参数）：

| 场景 | 默认 BPM | 默认时长 | 风格关键词（正向提示词） |
|------|----------|----------|--------------------------|
| 高效助眠 | 58 | 300s | sleep, deep rest, slow ambient, no vocals |
| 舒缓焦虑 | 62 | 240s | anxiety relief, calm, soft pads, breathing |
| 抵抗抑郁 | 65 | 240s | uplifting gentle, warm, hope, instrumental |
| 止痛镇痛 | 60 | 180s | pain relief, low stimulation, minimal |
| 头痛/偏头痛 | 55 | 180s | headache relief, very slow, sparse |
| 调理肠胃 | 64 | 200s | digestive calm, gentle flow, neutral |
| 快速止痒 | 66 | 120s | distraction calm, light texture |
| 缓解鼻塞 | 60 | 150s | clear breathing, airy, soft |
| 快速止咳 | 58 | 150s | throat soothe, warm ambient |
| 恶心呕吐 | 56 | 120s | anti-nausea, stable, low motion |

### 4.2 生活场景（精选 8 类入口）

| 分类 | 代表标签 |
|------|----------|
| 心理健康 | 冥想、正念、情绪稳定 |
| 睡眠类 | 入眠、深睡、小憩 |
| 日常健康 | 晨间唤醒（轻柔）、午后放松 |
| 国风疗愈 | 古琴、箫、琵琶、雨夜窗前台 |
| 疼痛类 | 肌肉放松、术后舒缓（对接实验室方向） |
| 心脑血管 | 慢节奏、低刺激（需谨慎表述，仅音乐参数） |
| 消化类 | 餐后放松 |
| 艺术疗愈 | 艺术嗓音康复辅助纯音乐（无人声版） |

### 4.3 国风疗愈专用模板（已有基础，需升级文案）

**正向（默认）：**

```
meditation, healing, Chinese traditional instrumental,
guqin, xiao, pipa, slow tempo, warm reverb,
peaceful, no vocals, gentle dynamics
```

**负向（默认）：**

```
vocals, singing, lyrics, speech, drums, aggressive,
loud, EDM, pop, rock, sudden dynamics
```

**实施文件：** 新建 `data/nightingaleScenarios.ts`，`CreatePanel.tsx` 读取场景 Chip。

---

## 五、生成参数默认值

| 参数 | 通用默认 | 助眠场景 | LoRA 训练默认 |
|------|----------|----------|---------------|
| 纯器乐 | ✓ 锁定 | ✓ | 数据集「全器乐」✓ |
| BPM | 65 | 58 | — |
| 时长 | 240s | 300s | — |
| 调性 | D minor | C major | — |
| 拍号 | 4/4 | 4/4 | — |
| Batch | 1 | 1 | 1 |
| 推理步数 | 12（SFT 可 50） | 12 | — |
| LM / Thinking | 关 | 关 | — |
| AI Enhance | 关（可选手动开） | 关 | — |

**实施文件：** `data/healingPresets.ts`（已存在，按上表扩展）

---

## 六、LoRA 微调 UI 调制

对齐展架「百万级语料 / 可复制疗愈方案」叙事：

| 模块 | 调制 |
|------|------|
| Tab 名称 | 「风格训练」 |
| 说明文案 | 基于上音疗愈语料风格，训练专属 LoRA 适配器 |
| 数据集构建 | 保留：扫描文件夹 → 标注 → 预处理 |
| 隐藏 | LoKr 实验 Tab |
| 默认超参 | rank 48 / alpha 96 / lr 1e-4 / epochs 5 / dropout 0.08 |
| 激活标签 | 建议统一前缀 `<nightingale>` 或 `<soothe>` |

**实施文件：** `components/TrainingPanel.tsx`、`data/healingPresets.ts`

---

## 七、文案对照表（i18n 关键键）

| Key | 英文（保留备用） | 中文（调制） |
|-----|------------------|--------------|
| aceStepUI | Nightingale | 夜莺工坊 |
| welcomeTitle | Welcome to Nightingale | 欢迎使用夜莺视听疗愈 AI |
| welcomeSubtitle | Start your healing journey | 选择场景，生成专属疗愈纯音乐 |
| create | Create | 疗愈生成 |
| library | Library | 疗愈曲库 |
| training | Training | 风格训练 |
| yourMusicYourWay | … | 脑舒科技 SOOTHE · 上音 AI 音乐疗愈实验室 |

**实施文件：** `i18n/translations.ts`

---

## 八、与展架数据话术的统一

可在「关于 / 设置 / 页脚」展示（不做夸大，与展架一致）：

- 情绪识别准确率 **>92%**（标注：HRV 模块接入后展示）
- 疗愈场景 **500+**（标注：场景库持续扩展）
- HRV 平均改善 **+38%**（P2：生成后验证页）
- **10 大**临床场景 / **24 类**生活场景（场景 Chip 来源）

---

## 九、实施路线图

### P0 — 展架演示可用（1–2 天）

- [x] ace-step-ui 本地跑通 + 中文用户名
- [x] `HEALING_MODE` 默认纯器乐 / BPM / 时长
- [ ] 品牌改名：夜莺 / SOOTHE / 上音实验室
- [ ] 视觉：青绿低饱和主题，替换粉紫渐变
- [ ] 隐藏 News、视频、人声、歌词、翻唱相关控件
- [ ] 十大临床场景 Chip + 国风标签

### P1 — 内网 GPU 联调（10.101.9.209）

- [ ] 云端部署 ace-step-ui + ACE-Step XL-SFT
- [ ] `--init_service` 完整生成链路
- [ ] LoRA 训练走通 + 导出回灌
- [ ] VPN 内网访问 `http://10.101.9.209:3000`

### P2 — 闭环增强

- [ ] HRV 状态输入 → 自动推荐场景（接口预留）
- [ ] 生成前后 HRV 对比展示
- [ ] 场景库扩展至 500+（配置化 JSON）
- [ ] Soothe 硬件/APP 品牌统一登录

---

## 十、代码文件映射速查

| 调制项 | 文件路径 |
|--------|----------|
| 场景预设 / 默认值 | `ace-step-ui/data/healingPresets.ts` |
| 临床场景 Chip（待建） | `ace-step-ui/data/nightingaleScenarios.ts` |
| 创作页布局 | `ace-step-ui/components/CreatePanel.tsx` |
| 导航裁剪 | `ace-step-ui/components/Sidebar.tsx` |
| 中文文案 | `ace-step-ui/i18n/translations.ts` |
| 主题 CSS | `ace-step-ui/src/styles/healing-theme.css`（待建） |
| 训练页 | `ace-step-ui/components/TrainingPanel.tsx` |
| 品牌常量 | `ace-step-ui/data/healingPresets.ts` → 改名为 `nightingaleBrand.ts` |
| 本地启动 | `ace-step-ui/start-all-local.sh` |
| AI 引擎 | `ACE-Step 1.5 XL SFT` + `acestep-v15-xl-sft` |

---

## 十一、验收标准

1. 打开 UI 首屏即见 **夜莺 / SOOTHE / 上音实验室** 品牌识别，无 Suno/通用音乐生成语义  
2. 默认 **纯器乐**，无歌词/人声/翻唱入口  
3. 一键选择 **十大临床场景** 之一即可生成，参数自动填充  
4. 视觉为 **低饱和青绿米白**，无高饱和霓虹  
5. LoRA 训练 Tab 可用，默认超参符合疗愈语料微调习惯  
6. 内网服务器可稳定访问并完成至少 1 次完整生成  

---

*上海脑舒科技有限公司 · SOOTHE · 上海音乐学院人工智能音乐疗愈重点实验室 · 2026*
