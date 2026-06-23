<h1 align="center">🌙 夜莺 · Nightingale</h1>
<h3 align="center">全球首个视听疗愈 AI 大模型</h3>
<h4 align="center">The World's First Audio-Visual Healing AI Foundation Model</h4>

<p align="center">
    <em>从监测到判定，从判定到疗愈，从疗愈到验证——构建全球首个可量化的身心健康 AI 闭环</em>
</p>

<p align="center">
    <a href="#-快速开始">快速开始</a> |
    <a href="#-核心技术">核心技术</a> |
    <a href="#-临床场景">临床场景</a> |
    <a href="#-模型架构">模型架构</a> |
    <a href="https://www.soothebci.com">官网</a> |
    <a href="https://huggingface.co/ACE-Step/Ace-Step1.5">Hugging Face</a> |
    <a href="https://arxiv.org/abs/2602.00744">技术报告</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/Python-3.11--3.12-blue.svg" alt="Python">
    <img src="https://img.shields.io/badge/ACE--Step-v1.5-orange.svg" alt="ACE-Step">
    <img src="https://img.shields.io/badge/LoRA-Healing%20Fine--tuned-purple.svg" alt="LoRA">
</p>

---

## 📋 目录

- [项目简介](#-项目简介)
- [关于我们](#-关于我们)
- [核心技术](#-核心技术)
- [临床场景](#-临床场景)
- [快速开始](#-快速开始)
- [模型架构](#-模型架构)
- [核心数据](#-核心数据)
- [致谢](#-致谢)
- [许可证](#-许可证)

---

## 🌟 项目简介

**夜莺（Nightingale）** 是全球首个瞄准身心疗愈场景落地的 AI 视听垂类大模型，基于开源 [ACE-Step 1.5](https://github.com/ACE-Step/ACE-Step-1.5) 音乐生成模型，通过上海音乐学院权威疗愈音乐语料库进行 **LoRA 深度微调**，实现从生理监测到专案疗愈的完整闭环。

### 核心特色

| 特性 | 说明 |
|------|------|
| 🎵 **疗愈音乐生成** | 基于百万级疗愈音乐语料库深度训练的 LoRA 模型 |
| 🧠 **临床场景匹配** | 覆盖十大临床应用场景、24 大生活应用场景 |
| 🎼 **国风疗愈** | 支持古筝、琵琶、二胡、竹笛、古琴等中国传统乐器 |
| ⚡ **高效推理** | A100 上 2 秒生成完整曲目，RTX 3090 上 10 秒内 |
| 🔬 **科学验证** | 与上海音乐学院 AI 音乐疗愈重点实验室战略合作 |
| 📖 **完全开源** | MIT 协议，可自由使用、修改和商业化 |

---

## 🏢 关于我们

### 上海脑舒科技 · SOOTHE

上海脑舒科技有限公司（品牌：**SOOTHE**）是国内领先的医疗级 AI 数字疗愈企业，深耕高增长的身心健康赛道。公司由市北高新孵化成立，在上海经信委、文旅局与静安区人民政府联手打造的上海超高清视听产业集聚区发展成长。

公司核心技术方向为 **脑科学·多模态垂类 AI 大模型** 与软硬件一体化解决方案，立足上海，推进全球化布局，致力于以 AI 赋能解决身心健康服务稀缺与高成本痛点。

### 上海音乐学院 · AI 音乐疗愈重点实验室

上海音乐学院人工智能音乐疗愈重点实验室于 **2024 年 11 月** 正式成立，是国内首个融合 **艺术学·医学·工学** 三大一级学科的交叉重点实验室。

实验室秉持跨学科研究思路，深耕艺术、科技、医学交叉方向，研究范畴涵盖音乐人工智能、音乐疗愈、声音脑科学、艺术嗓音学等前沿学科。

**核心负责人：**
- 首席专家：廖昌永（上海音乐学院院长）
- 学术委员会主任：毛颖（复旦大学附属华山医院院长）
- 实验室主任：刘灏（上海音乐学院）

---

## 🧬 核心技术

### HRV 情绪解码算法（独家）

```
生理监测 → HRV 情绪解码 → 疗愈方案匹配 → 音乐生成 → 效果验证
```

- 通过 HRV 心率变异性数据精准判定当前身心状态
- 依托时域-频域分析识别压力、疲劳等多种身心状态
- 二维连续环形情绪空间定位，映射音乐十大要素
- 基于百万级疗愈音乐语料库深度机器学习训练
- 毫秒级流式交互，综合准确率 **> 92%**

### 夜莺大模型能力

- 基于 ACE-Step 1.5 DiT + LM 混合架构
- 上海音乐学院权威疗愈音乐语料库 LoRA 深度微调
- **500+** 疗愈场景智能动态匹配与生成
- 覆盖十大临床应用场景、24 大生活应用场景
- 支持 50+ 语言歌词生成与多种音乐风格

### 技术架构

本项目基于 [ACE-Step 1.5](https://github.com/ACE-Step/ACE-Step-1.5) 开源模型：

- **DiT（Diffusion Transformer）**：2B / 4B 参数量的音频生成核心
- **LM（Language Model）**：0.6B / 1.7B / 4B 参数量的智能规划器
- **LoRA 微调**：基于疗愈音乐语料库的轻量级个性化适配
- **VAE 解码器**：高保真音频重建

---

## 🏥 临床场景

### 十大临床应用场景

| 场景 | 说明 | 推荐参数 |
|------|------|----------|
| 😴 高效助眠 | 深度睡眠诱导 | BPM 50, C major, 5min |
| 😰 舒缓焦虑 | 自然音景放松 | BPM 60, G major, 3min |
| 🧘 冥想放松 | 颂钵+环境音 | BPM 40, A minor, 10min |
| 🎯 专注力提升 | Lo-fi + 双耳节拍 | BPM 72, D major, 4min |
| 💊 止痛镇痛 | 温暖音垫舒缓 | BPM 55, F major, 3min |
| 🏥 术后恢复 | 柔和管弦乐 | BPM 65, Bb major, 4min |
| 🤕 头痛/偏头痛 | 低频共振缓解 | BPM 45, Eb major, 5min |
| 🤢 恶心呕吐 | 稳定节奏安抚 | BPM 58, Ab major, 3min |
| 😔 抵抗抑郁 | 明亮旋律激励 | BPM 80, D major, 4min |
| 🫁 缓解鼻塞/止咳 | 呼吸频率引导 | BPM 52, G major, 5min |

### 24 大生活应用场景

心理健康 · 日常健康 · 疼痛类 · 心脑血管 · 睡眠类 · 消化类等全覆盖

---

## ⚡ 快速开始

> **环境要求：** Python 3.11-3.12，推荐 CUDA GPU（也支持 MPS / ROCm / Intel XPU / CPU）

```bash
# 1. 安装 uv
curl -LsSf https://astral.sh/uv/install.sh | sh          # macOS / Linux
# powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"  # Windows

# 2. 克隆 & 安装
git clone https://github.com/520kisa520/ACE-Step-1.5-Nightingale.git
cd ACE-Step-1.5-Nightingale
uv sync

# 3. 启动 Gradio UI（首次运行自动下载模型）
uv run acestep

# 或启动 REST API 服务
uv run acestep-api
```

打开 http://localhost:7860 （Gradio）或 http://localhost:8001 （API）。

### 启动夜莺 UI

```bash
# 进入 UI 目录
cd ui/ace-step-ui

# 安装依赖
npm install

# 启动后端服务
cd server && npm install && npm run dev &

# 启动前端开发服务器
cd .. && npm run dev
```

打开 http://localhost:3000 即可使用夜莺疗愈音乐生成界面。

### GPU 推荐配置

| GPU 显存 | 推荐 DiT | 推荐 LM 模型 | 说明 |
|----------|----------|-------------|------|
| **≤6GB** | 2B turbo | 无（纯 DiT） | INT8 量化 + CPU 全卸载 |
| **6-8GB** | 2B turbo | 0.6B | 轻量 LM |
| **8-16GB** | 2B turbo/sft | 0.6B / 1.7B | 推荐配置 |
| **16-20GB** | 2B sft 或 XL turbo | 1.7B | XL 需 CPU 卸载 |
| **≥20GB** | XL sft | 4B | 最佳质量 |

---

## 🏗️ 模型架构

```
┌─────────────────────────────────────────────────────────┐
│                    夜莺 · Nightingale                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐  │
│  │ HRV 监测  │───▶│ 情绪解码  │───▶│ 疗愈方案智能匹配  │  │
│  └──────────┘    └──────────┘    └────────┬─────────┘  │
│                                           │             │
│  ┌────────────────────────────────────────▼──────────┐  │
│  │              ACE-Step 1.5 Base Model               │  │
│  │  ┌─────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │ LM 规划器│  │ DiT 音频生成 │  │ VAE 音频解码  │  │  │
│  │  └─────────┘  └─────────────┘  └──────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌───────────────────────▼────────────────────────────┐  │
│  │         LoRA 疗愈微调层（上海音乐学院语料库）         │  │
│  └────────────────────────────────────────────────────┘  │
│                          │                              │
│                          ▼                              │
│              🎵 疗愈音乐输出 + 效果验证                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 核心数据

<table align="center">
<tr>
<td align="center"><strong>92%+</strong><br>情绪识别准确率</td>
<td align="center"><strong>500+</strong><br>疗愈场景覆盖</td>
<td align="center"><strong>+38%</strong><br>HRV 平均改善率</td>
<td align="center"><strong>10 大</strong><br>临床应用场景</td>
</tr>
<tr>
<td align="center"><strong>百万+</strong><br>疗愈音乐语料库</td>
<td align="center"><strong>50+</strong><br>支持语言</td>
<td align="center"><strong>< 2s</strong><br>A100 生成速度</td>
<td align="center"><strong>< 4GB</strong><br>最低显存需求</td>
</tr>
</table>

---

## 🔬 科研特色

- 突破传统心理学边界，将音乐疗愈延伸至神经科学研究层面
- 推进定制化声音疗愈胶囊与声音脑科学语料库搭建
- 聚焦艺术嗓音疗愈、术后康复、早产儿脑科学干预、老年身心健康管理等落地场景
- 成功搭建 **基础研究—设备研发—临床验证—社会服务** 完整产业生态链
- 运用 AI 技术完成音乐参数智能解析与重组，实现疗愈方案精准化、标准化、可复制

---

## 📚 文档

| 内容 | 链接 |
|------|------|
| 安装指南 | [中文](./docs/zh/INSTALL.md) \| [English](./docs/en/INSTALL.md) \| [日本語](./docs/ja/INSTALL.md) |
| Gradio 使用指南 | [中文](./docs/zh/GRADIO_GUIDE.md) \| [English](./docs/en/GRADIO_GUIDE.md) |
| API 文档 | [中文](./docs/zh/API.md) \| [English](./docs/en/API.md) |
| LoRA 训练教程 | [中文](./docs/zh/LoRA_Training_Tutorial.md) \| [English](./docs/en/LoRA_Training_Tutorial.md) |
| GPU 兼容性 | [中文](./docs/zh/GPU_COMPATIBILITY.md) \| [English](./docs/en/GPU_COMPATIBILITY.md) |

---

## 🙏 致谢

本项目基于以下开源项目构建：

- [ACE-Step 1.5](https://github.com/ACE-Step/ACE-Step-1.5) — 高效开源音乐基础模型（ACE Studio & StepFun）
- [Hugging Face](https://huggingface.co/ACE-Step) — 模型托管与社区

特别感谢：
- **上海音乐学院人工智能音乐疗愈重点实验室** — 疗愈音乐语料库与科研支持
- **上海脑舒科技有限公司（SOOTHE）** — HRV 情绪解码算法与产品化支持

---

## 📜 许可证

本项目基于 [MIT License](./LICENSE) 开源。

本项目旨在推动音乐疗愈技术的普及与发展，请用户在使用时遵守相关法律法规，尊重音乐创作者权益，不得将生成内容用于非法或有害目的。

---

<p align="center">
    <strong>上海脑舒科技有限公司 · SOOTHE</strong><br>
    <strong>上海音乐学院人工智能音乐疗愈重点实验室</strong><br>
    <em>艺术学 × 医学 × 工学 · 视听疗愈 AI 研究与实践</em><br>
    2026 年 6 月
</p>
