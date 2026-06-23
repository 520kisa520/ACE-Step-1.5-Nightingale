# 疗愈纯音乐 UI 开发指南

> **完整调制方案（展架版）：** `/Users/yangweijia/Downloads/ace-step-ui/docs/UI调制方案-夜莺疗愈.md`

UI 使用 **[ace-step-ui](https://github.com/fspecii/ace-step-ui)**，对接本目录的 ACE-Step 1.5 引擎。

**环境隔离：Python → `ACE-Step 1.5 XL SFT/.venv`，Node → `ace-step-ui/node_modules`**

---

## 目录

```
Downloads/
├── ACE-Step 1.5 XL SFT/     ← AI 引擎 + .venv
└── ace-step-ui/             ← React UI（你要改的主要在这里）
    ├── data/healingPresets.ts   ← 疗愈默认值（首选修改）
    ├── components/CreatePanel.tsx
    ├── i18n/translations.ts
    └── start-all-local.sh       ← 本地一键启动（无需 uv）
```

---

## 启动 UI（本地）

```bash
cd "/Users/yangweijia/Downloads/ace-step-ui"
export ACESTEP_PATH="/Users/yangweijia/Downloads/ACE-Step 1.5 XL SFT"
bash start-all-local.sh
```

浏览器：**http://localhost:3000**

停止：`bash stop-all-local.sh`

> 首次若缺 Python 依赖，在 ACE-Step 目录运行：  
> `bash scripts/setup_original_ui_env.sh`

---

## 疗愈定制（已开启 HEALING_MODE）

| 文件 | 作用 |
|------|------|
| `ace-step-ui/data/healingPresets.ts` | BPM 65、时长 240s、纯器乐、正向/负向提示词 |
| `ace-step-ui/i18n/translations.ts` | 中文标题「静听工坊」等 |
| `ace-step-ui/components/CreatePanel.tsx` | 表单布局（隐藏人声/翻唱需继续改这里） |

改完保存，Vite 会自动热更新；若未刷新，重启 `start-all-local.sh`。

---

## 云端 10.101.9.209

同步两个目录后，同样使用 `start-all-local.sh`（或 `./start-all.sh` 若已装 uv），绑定 `0.0.0.0` 供 VPN 访问。

---

## 服务端口

| 服务 | 地址 |
|------|------|
| 前端 UI | http://localhost:3000 |
| UI 后端 | http://localhost:3001 |
| ACE-Step API | http://localhost:8001 |

日志：`ace-step-ui/logs/`
