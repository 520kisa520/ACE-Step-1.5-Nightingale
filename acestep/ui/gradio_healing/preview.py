"""
疗愈 UI 本地预览（仅需 gradio，无需 GPU / 模型）。

用法:
    pip3 install gradio==6.2.0
    python3 acestep/ui/gradio_healing/preview.py

浏览器打开: http://127.0.0.1:7861
"""

from __future__ import annotations

import os
import sys

# 允许从项目根目录或本文件目录运行
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

import gradio as gr  # noqa: E402

from acestep.ui.gradio_healing import presets  # noqa: E402

_LOGO_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../assets/acemusic-logo.svg")
)


def _load_css() -> str:
    css_path = os.path.join(os.path.dirname(__file__), "theme.css")
    with open(css_path, encoding="utf-8") as f:
        return f.read()


def build_preview() -> gr.Blocks:
    theme = gr.themes.Base(
        primary_hue=gr.themes.colors.violet,
        secondary_hue=gr.themes.colors.cyan,
        neutral_hue=gr.themes.colors.slate,
        font=gr.themes.GoogleFont("Inter"),
    ).set(
        body_background_fill="#050816",
        block_background_fill="rgba(12, 18, 40, 0.72)",
        block_border_color="rgba(122, 138, 180, 0.22)",
        button_primary_background_fill="linear-gradient(135deg, #7c4dff 0%, #00d4ff 100%)",
        button_primary_background_fill_hover="#9068ff",
    )

    with gr.Blocks(
        title=presets.APP_TITLE,
        theme=theme,
        css=_load_css(),
    ) as demo:
        gr.HTML(
            f"""
            <div class="main-header">
                <img class="logo-mark" src="file={_LOGO_PATH}" alt="ACE Music Logo">
                <h1>{presets.APP_TITLE}</h1>
                <p>{presets.APP_SUBTITLE}</p>
            </div>
            <div class="healing-guide">
                <strong>本地预览模式</strong> — 仅展示布局与文案，点击「生成」不会出音频。<br>
                完整功能请在 <code>10.101.9.209</code> 云端启动
                <code>python3 -m acestep.ui.gradio_healing.launch</code>
            </div>
            """
        )

        with gr.Accordion("⚙️ 设置（云端需先初始化模型）", open=False):
            gr.Dropdown(
                choices=[presets.DEFAULT_CONFIG_PATH],
                value=presets.DEFAULT_CONFIG_PATH,
                label="主模型",
            )
            gr.Button("初始化服务", variant="secondary")

        with gr.Tabs():
            with gr.Tab("🎋 纯音乐生成"):
                gr.Radio(
                    choices=presets.GENERATION_MODES,
                    value="Custom",
                    label="创作方式",
                )
                with gr.Group():
                    gr.Textbox(
                        label="疗愈场景描述（Simple）",
                        placeholder=presets.SIMPLE_QUERY_PLACEHOLDER,
                        lines=2,
                    )
                with gr.Group():
                    gr.Textbox(
                        label="正向提示词（Custom）",
                        value=presets.POSITIVE_PROMPT_TEMPLATE,
                        lines=8,
                    )
                    gr.Checkbox(
                        label="纯器乐（无人声）",
                        value=presets.DEFAULT_INSTRUMENTAL,
                        interactive=False,
                    )
                with gr.Accordion("🎚️ 乐曲参数", open=True):
                    with gr.Row():
                        gr.Number(label="BPM", value=presets.DEFAULT_BPM)
                        gr.Number(label="时长（秒）", value=presets.DEFAULT_DURATION_SECONDS)
                        gr.Textbox(label="调性", value=presets.DEFAULT_KEY_SCALE)
                    gr.Textbox(
                        label="负向提示词参考",
                        value=presets.NEGATIVE_PROMPT_TEMPLATE,
                        lines=3,
                    )
                gr.Button("🎵 生成", variant="primary", size="lg")
                gr.Audio(label="生成结果（预览模式无输出）", interactive=False)

            with gr.Tab("🎋 LoRA 微调"):
                gr.Markdown(f"### {presets.TRAINING_HEADER}")
                with gr.Tabs():
                    with gr.Tab("数据集构建"):
                        gr.Textbox(label="音频文件夹路径", placeholder="./datasets/raw_audio")
                        gr.Button("扫描音频")
                    with gr.Tab("训练 LoRA"):
                        with gr.Row():
                            gr.Slider(4, 256, value=presets.LORA_RANK, step=4, label="LoRA Rank")
                            gr.Slider(4, 512, value=presets.LORA_ALPHA, step=4, label="LoRA Alpha")
                            gr.Slider(0, 0.5, value=presets.LORA_DROPOUT, step=0.05, label="Dropout")
                        with gr.Row():
                            gr.Number(label="Learning Rate", value=presets.LORA_LEARNING_RATE)
                            gr.Slider(1, 100, value=presets.LORA_EPOCHS, step=1, label="Epochs")
                        gr.Button("开始训练", variant="primary")

    return demo


def main() -> None:
    demo = build_preview()
    demo.launch(
        server_name="127.0.0.1",
        server_port=7861,
        inbrowser=True,
        show_error=True,
    )


if __name__ == "__main__":
    main()
