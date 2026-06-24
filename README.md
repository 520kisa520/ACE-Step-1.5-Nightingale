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
    <a href="https://www.soothebci.com">官网</a> |
    <a href="https://huggingface.co/ACE-Step/Ace-Step1.5">Hugging Face</a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/React-19-blue.svg" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.8-blue.svg" alt="TypeScript">
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
- [项目结构](#-项目结构)
- [核心数据](#-核心数据)
- [致谢](#-致谢)

---

## 🌟 项目简介

**夜莺（Nightingale）** 是全球首个瞄准身心疗愈场景落地的 AI 视听垂类大模型应用平台，基于开源 [ACE-Step 1.5](https://github.com/ACE-Step/ACE-Step-1.5) 音乐生成模型，通过百万级疗愈音乐语料库进行 **LoRA 深度微调**，实现从生理监测到专案疗愈的完整闭环。

本仓库包含夜莺的 **Web UI 前端** 和 **后端服务**，提供完整的疗愈音乐生成交互界面。

### 核心特色

| 特性 | 说明 |
|------|------|
| 🎵 **疗愈音乐生成** | 基于百万级疗愈音乐语料库深度训练的 LoRA 模型 |
| 🧠 **临床场景匹配** | 覆盖十大临床应用场景、24 大生活应用场景 |
| 🎼 **国风疗愈** | 支持古筝、琵琶、二胡、竹笛、古琴等中国传统乐器 |
| ⚡ **高效推理** | A100 上 2 秒生成完整曲目，RTX 3090 上 10 秒内 |
| 🔬 **科学验证** | 脑舒科技自研 HRV 情绪解码算法，临床数据驱动 |
| 📖 **完全开源** | MIT 协议，可自由使用、修改和商业化 |

---

## 🏢 关于我们

### 上海脑舒科技 · SOOTHE

上海脑舒科技有限公司（品牌：**SOOTHE**）是国内领先的医疗级 AI 数字疗愈企业，深耕高增长的身心健康赛道。公司由市北高新孵化成立，在上海经信委、文旅局与静安区人民政府联手打造的上海超高清视听产业集聚区发展成长。

公司核心技术方向为 **脑科学·多模态垂类 AI 大模型** 与软硬件一体化解决方案，立足上海，推进全球化布局，致力于以 AI 赋能解决身心健康服务稀缺与高成本痛点。


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
- 百万级疗愈音乐语料库 LoRA 深度微调
- **500+** 疗愈场景智能动态匹配与生成
- 覆盖十大临床应用场景、24 大生活应用场景
- 支持 50+ 语言歌词生成与多种音乐风格

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

### 前置要求

- Node.js 18+
- ACE-Step 1.5 推理服务运行中（提供音乐生成 API）

### 安装与启动

```bash
# 1. 克隆仓库
git clone https://github.com/520kisa520/ACE-Step-1.5-Nightingale.git
cd ACE-Step-1.5-Nightingale

# 2. 安装前端依赖
cd ui/ace-step-ui
npm install

# 3. 安装并启动后端服务
cd server
npm install
npm run dev &

# 4. 启动前端开发服务器
cd ..
npm run dev
```

打开 http://localhost:3000 即可使用夜莺疗愈音乐生成界面。

### 连接 ACE-Step 推理后端

UI 默认连接 `http://localhost:8001` 的 ACE-Step API 服务。请确保 ACE-Step 推理服务已启动：

```bash
# 在 ACE-Step 1.5 目录下
git clone https://github.com/ACE-Step/ACE-Step-1.5.git
cd ACE-Step-1.5
uv sync
uv run acestep-api
```

---

## 📁 项目结构

```
ACE-Step-1.5-Nightingale/
├── ui/ace-step-ui/          # 夜莺 Web 应用
│   ├── components/          # React UI 组件
│   │   ├── CreatePanel.tsx  # 音乐生成面板（临床场景、国风标签）
│   │   ├── Sidebar.tsx      # 导航侧边栏
│   │   ├── Player.tsx       # 音频播放器
│   │   ├── LibraryView.tsx  # 曲库管理
│   │   ├── SearchPage.tsx   # 搜索页面
│   │   └── ...
│   ├── server/              # 后端服务（Express + SQLite）
│   │   ├── src/
│   │   │   ├── routes/      # API 路由
│   │   │   ├── services/    # 业务逻辑
│   │   │   └── db/          # 数据库
│   │   └── package.json
│   ├── context/             # React Context（认证、国际化、主题）
│   ├── services/            # API 调用服务
│   ├── i18n/                # 多语言支持
│   ├── data/                # 疗愈预设数据
│   ├── App.tsx              # 应用入口
│   ├── package.json
│   └── vite.config.ts
├── .claude/skills/          # AI Agent 技能配置
├── README.md
└── LICENSE
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

## 🙏 致谢

本项目基于以下开源项目构建：

- [ACE-Step 1.5](https://github.com/ACE-Step/ACE-Step-1.5) — 高效开源音乐基础模型（ACE Studio & StepFun）

开发单位：
- **上海脑舒科技有限公司（SOOTHE）** — HRV 情绪解码算法与产品化支持

---

## 📜 许可证

本项目基于 [MIT License](./LICENSE) 开源。

---

<p align="center">
    <strong>上海脑舒科技有限公司 · SOOTHE</strong><br>
    <em>脑科学 × AI × 数字疗愈</em><br>
    2026 年 6 月
</p>
