"""Runtime patches that apply healing UI presets to the stock Gradio builders."""

from __future__ import annotations

import copy
import json
import os
from functools import wraps
from typing import Any

import gradio as gr

from acestep.ui.gradio_healing import presets


def _deep_merge(base: dict, overlay: dict) -> dict:
    merged = copy.deepcopy(base)
    for key, value in overlay.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = _deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def _load_healing_css() -> str:
    css_path = os.path.join(os.path.dirname(__file__), "theme.css")
    with open(css_path, encoding="utf-8") as handle:
        return handle.read()


def _load_i18n_overlay() -> dict:
    json_path = os.path.join(os.path.dirname(__file__), "i18n_zh_healing.json")
    with open(json_path, encoding="utf-8") as handle:
        return json.load(handle)


def _healing_theme() -> gr.themes.Base:
    return gr.themes.Base(
        primary_hue=gr.themes.colors.violet,
        secondary_hue=gr.themes.colors.cyan,
        neutral_hue=gr.themes.colors.slate,
        font=gr.themes.GoogleFont("Inter"),
    ).set(
        body_background_fill="#050816",
        block_background_fill="rgba(12, 18, 40, 0.72)",
        block_border_color="rgba(122, 138, 180, 0.22)",
        button_primary_background_fill="#7c4dff",
        button_primary_background_fill_hover="#00d4ff",
    )


def _patch_i18n() -> None:
    from acestep.ui.gradio.i18n import i18n as i18n_module

    original_get_i18n = i18n_module.get_i18n
    overlay = _load_i18n_overlay()
    merged_once = False

    @wraps(original_get_i18n)
    def patched_get_i18n(language: str | None = None):
        nonlocal merged_once
        instance = original_get_i18n(language)
        if not merged_once and "zh" in instance.translations:
            instance.translations["zh"] = _deep_merge(instance.translations["zh"], overlay)
            instance.translations["zh"]["app"]["title"] = presets.APP_TITLE
            instance.translations["zh"]["app"]["subtitle"] = presets.APP_SUBTITLE
            merged_once = True
        return instance

    i18n_module.get_i18n = patched_get_i18n


def _patch_generation_modes() -> None:
    import acestep.constants as constants

    constants.GENERATION_MODES_TURBO = list(presets.GENERATION_MODES)
    constants.GENERATION_MODES_BASE = list(presets.GENERATION_MODES)


def _patch_optional_controls() -> None:
    import acestep.ui.gradio.interfaces.generation_tab_optional_controls as module

    original = module.build_optional_parameter_controls

    @wraps(original)
    def patched(
        max_duration: float,
        max_batch_size: int,
        default_batch_size: int,
        service_mode: bool,
    ) -> dict[str, Any]:
        from acestep.constants import VALID_LANGUAGES
        from acestep.ui.gradio.i18n import t

        duration = min(presets.DEFAULT_DURATION_SECONDS, float(max_duration))
        batch_size = min(presets.DEFAULT_BATCH_SIZE, max_batch_size)

        with gr.Accordion(
            t("generation.optional_params"),
            open=True,
            visible=True,
            elem_classes=["has-info-container"],
        ) as optional_params_accordion:
            with gr.Row():
                bpm = gr.Number(
                    label=t("generation.bpm_label"),
                    value=presets.DEFAULT_BPM,
                    step=1,
                    info=t("generation.bpm_info"),
                    elem_classes=["has-info-container"],
                    interactive=not service_mode,
                )
                key_scale = gr.Textbox(
                    label=t("generation.keyscale_label"),
                    placeholder=t("generation.keyscale_placeholder"),
                    value=presets.DEFAULT_KEY_SCALE,
                    info=t("generation.keyscale_info"),
                    elem_classes=["has-info-container"],
                    interactive=not service_mode,
                )
                time_signature = gr.Dropdown(
                    choices=["", "2", "3", "4", "6", "N/A"],
                    value=presets.DEFAULT_TIME_SIGNATURE,
                    label=t("generation.timesig_label"),
                    allow_custom_value=True,
                    info=t("generation.timesig_info"),
                    elem_classes=["has-info-container"],
                    interactive=not service_mode,
                )
                vocal_language = gr.Dropdown(
                    choices=[
                        (lang if lang != "unknown" else "Instrumental / auto", lang)
                        for lang in VALID_LANGUAGES
                    ],
                    value="unknown",
                    label=t("generation.vocal_language_label"),
                    info=t("generation.vocal_language_info"),
                    allow_custom_value=True,
                    elem_classes=["has-info-container"],
                    interactive=False,
                    visible=not presets.HIDE_VOCAL_LANGUAGE,
                )
            with gr.Row(elem_classes=["auto-toggles-row"]):
                bpm_auto = gr.Checkbox(
                    label=t("generation.bpm_auto_label"),
                    value=presets.DEFAULT_BPM_AUTO,
                    container=False,
                    elem_classes=["auto-toggle"],
                )
                key_auto = gr.Checkbox(
                    label=t("generation.key_auto_label"),
                    value=False,
                    container=False,
                    elem_classes=["auto-toggle"],
                )
                timesig_auto = gr.Checkbox(
                    label=t("generation.timesig_auto_label"),
                    value=False,
                    container=False,
                    elem_classes=["auto-toggle"],
                )
                vocal_lang_auto = gr.Checkbox(
                    label=t("generation.vocal_lang_auto_label"),
                    value=True,
                    container=False,
                    elem_classes=["auto-toggle"],
                    visible=not presets.HIDE_VOCAL_LANGUAGE,
                )
            with gr.Row():
                audio_duration = gr.Number(
                    label=t("generation.duration_label"),
                    value=duration,
                    minimum=-1,
                    maximum=float(max_duration),
                    step=0.1,
                    info=t("generation.duration_info")
                    + f" (Max: {max_duration}s / {max_duration // 60} min)",
                    elem_classes=["has-info-container"],
                    interactive=not service_mode,
                )
                batch_size_input = gr.Number(
                    label=t("generation.batch_size_label"),
                    value=batch_size,
                    minimum=1,
                    maximum=max_batch_size,
                    step=1,
                    info=t("generation.batch_size_info") + f" (Max: {max_batch_size})",
                    elem_classes=["has-info-container"],
                    interactive=not service_mode,
                )
            with gr.Row(elem_classes=["auto-toggles-row"]):
                duration_auto = gr.Checkbox(
                    label=t("generation.duration_auto_label"),
                    value=presets.DEFAULT_DURATION_AUTO,
                    container=False,
                    elem_classes=["auto-toggle"],
                )

        return {
            "optional_params_accordion": optional_params_accordion,
            "bpm": bpm,
            "key_scale": key_scale,
            "time_signature": time_signature,
            "vocal_language": vocal_language,
            "bpm_auto": bpm_auto,
            "key_auto": key_auto,
            "timesig_auto": timesig_auto,
            "vocal_lang_auto": vocal_lang_auto,
            "audio_duration": audio_duration,
            "batch_size_input": batch_size_input,
            "duration_auto": duration_auto,
        }

    module.build_optional_parameter_controls = patched


def _patch_simple_controls() -> None:
    import acestep.ui.gradio.interfaces.generation_tab_simple_controls as module

    original_build_input = module.build_simple_input_controls

    @wraps(original_build_input)
    def patched_build_input():
        from acestep.constants import VALID_LANGUAGES
        from acestep.ui.gradio.i18n import t

        simple_query_input = gr.Textbox(
            label=t("generation.simple_query_label"),
            placeholder=presets.SIMPLE_QUERY_PLACEHOLDER,
            lines=2,
            info=t("generation.simple_query_info"),
            elem_classes=["has-info-container"],
            scale=9,
        )
        with gr.Column(scale=1):
            simple_vocal_language = gr.Dropdown(
                choices=[
                    (lang if lang != "unknown" else "Instrumental / auto", lang)
                    for lang in VALID_LANGUAGES
                ],
                value="unknown",
                allow_custom_value=True,
                label=t("generation.simple_vocal_language_label"),
                interactive=True,
                scale=1,
                visible=not presets.HIDE_VOCAL_LANGUAGE,
            )
            simple_instrumental_checkbox = gr.Checkbox(
                label=t("generation.instrumental_label"),
                value=presets.DEFAULT_INSTRUMENTAL,
                scale=1,
                interactive=False,
            )
        return simple_query_input, simple_vocal_language, simple_instrumental_checkbox

    module.build_simple_input_controls = patched_build_input


def _patch_custom_controls() -> None:
    import acestep.ui.gradio.interfaces.generation_tab_secondary_controls as module

    original = module.build_custom_mode_controls

    @wraps(original)
    def patched():
        from acestep.ui.gradio.help_content import create_help_button
        from acestep.ui.gradio.i18n import t

        with gr.Group(visible=True, elem_classes=["has-info-container"]) as custom_mode_group:
            create_help_button("generation_custom")
            with gr.Row(equal_height=True):
                reference_audio = gr.Audio(
                    label=t("generation.reference_audio"),
                    type="filepath",
                    show_label=True,
                    visible=False,
                )
                with gr.Column(scale=8):
                    with gr.Row(equal_height=True):
                        with gr.Column(scale=1):
                            captions = gr.Textbox(
                                label=t("generation.caption_label"),
                                placeholder=t("generation.caption_placeholder"),
                                value=presets.POSITIVE_PROMPT_TEMPLATE,
                                lines=12,
                                max_lines=12,
                            )
                            with gr.Row(elem_classes="instrumental-row"):
                                format_caption_btn = gr.Button(
                                    t("generation.format_caption_btn"),
                                    variant="secondary",
                                    size="sm",
                                )
                        with gr.Column(scale=1, visible=not presets.HIDE_LYRICS_INPUT):
                            lyrics = gr.Textbox(
                                label=t("generation.lyrics_label"),
                                placeholder=t("generation.lyrics_placeholder"),
                                value="",
                                lines=12,
                                max_lines=12,
                            )
                            with gr.Row(elem_classes="instrumental-row"):
                                instrumental_checkbox = gr.Checkbox(
                                    label=t("generation.instrumental_label"),
                                    value=presets.DEFAULT_INSTRUMENTAL,
                                    scale=1,
                                    interactive=False,
                                )
                                format_lyrics_btn = gr.Button(
                                    t("generation.format_lyrics_btn"),
                                    variant="secondary",
                                    size="sm",
                                    scale=2,
                                    visible=False,
                                )
                with gr.Column(scale=1, min_width=80, elem_classes="icon-btn-wrap"):
                    sample_btn = gr.Button(
                        t("generation.sample_btn"), variant="primary", size="lg"
                    )
        return {
            "custom_mode_group": custom_mode_group,
            "reference_audio": reference_audio,
            "captions": captions,
            "format_caption_btn": format_caption_btn,
            "lyrics": lyrics,
            "instrumental_checkbox": instrumental_checkbox,
            "format_lyrics_btn": format_lyrics_btn,
            "sample_btn": sample_btn,
        }

    module.build_custom_mode_controls = patched


def _patch_training_defaults() -> None:
    import acestep.ui.gradio.interfaces.training as training_module
    import acestep.ui.gradio.interfaces.training_lora_tab_dataset as dataset_module
    import acestep.ui.gradio.interfaces.training_lora_tab_run_export as run_module

    def patched_epoch_defaults() -> tuple[int, int, int]:
        return presets.LORA_EPOCH_MIN, presets.LORA_EPOCH_STEP, presets.LORA_EPOCHS

    training_module._resolve_epoch_slider_defaults = patched_epoch_defaults

    original_dataset = dataset_module.build_lora_dataset_and_adapter_controls

    @wraps(original_dataset)
    def patched_dataset():
        from acestep.ui.gradio.i18n import t

        with gr.Row():
            with gr.Column(scale=2):
                gr.HTML(f"<h3>📊 {t('training.train_section_tensors')}</h3>")
                gr.Markdown(t("training.train_tensor_selection_desc"))
                training_tensor_dir = gr.Textbox(
                    label=t("training.preprocessed_tensors_dir"),
                    placeholder="./datasets/preprocessed_tensors",
                    value="./datasets/preprocessed_tensors",
                    info=t("training.preprocessed_tensors_info"),
                    elem_classes=["has-info-container"],
                )
                load_dataset_btn = gr.Button(
                    t("training.load_dataset_btn"), variant="secondary"
                )
                training_dataset_info = gr.Textbox(
                    label=t("training.dataset_info"),
                    interactive=False,
                    lines=3,
                )
            with gr.Column(scale=1):
                gr.HTML(f"<h3>⚙️ {t('training.train_section_lora')}</h3>")
                lora_rank = gr.Slider(
                    minimum=4,
                    maximum=256,
                    step=4,
                    value=presets.LORA_RANK,
                    label=t("training.lora_rank"),
                    info=t("training.lora_rank_info"),
                    elem_classes=["has-info-container"],
                )
                lora_alpha = gr.Slider(
                    minimum=4,
                    maximum=512,
                    step=4,
                    value=presets.LORA_ALPHA,
                    label=t("training.lora_alpha"),
                    info=t("training.lora_alpha_info"),
                    elem_classes=["has-info-container"],
                )
                lora_dropout = gr.Slider(
                    minimum=0.0,
                    maximum=0.5,
                    step=0.05,
                    value=presets.LORA_DROPOUT,
                    label=t("training.lora_dropout"),
                )
        return {
            "training_tensor_dir": training_tensor_dir,
            "load_dataset_btn": load_dataset_btn,
            "training_dataset_info": training_dataset_info,
            "lora_rank": lora_rank,
            "lora_alpha": lora_alpha,
            "lora_dropout": lora_dropout,
        }

    dataset_module.build_lora_dataset_and_adapter_controls = patched_dataset

    @wraps(run_module.build_lora_run_and_export_controls)
    def patched_run(*, epoch_min: int, epoch_step: int, epoch_default: int):
        from acestep.ui.gradio.i18n import t

        gr.HTML(f"<hr><h3>🎛️ {t('training.train_section_params')}</h3>")
        with gr.Row():
            learning_rate = gr.Number(
                label=t("training.learning_rate"),
                value=presets.LORA_LEARNING_RATE,
                info=t("training.learning_rate_info"),
                elem_classes=["has-info-container"],
            )
            train_epochs = gr.Slider(
                minimum=epoch_min,
                maximum=4000,
                step=epoch_step,
                value=epoch_default,
                label=t("training.max_epochs"),
            )
            train_batch_size = gr.Slider(
                minimum=1,
                maximum=8,
                step=1,
                value=presets.LORA_TRAIN_BATCH_SIZE,
                label=t("training.batch_size"),
                info=t("training.batch_size_info"),
                elem_classes=["has-info-container"],
            )
            gradient_accumulation = gr.Slider(
                minimum=1,
                maximum=16,
                step=1,
                value=presets.LORA_GRADIENT_ACCUMULATION,
                label=t("training.gradient_accumulation"),
                info=t("training.gradient_accumulation_info"),
                elem_classes=["has-info-container"],
            )
        with gr.Row():
            save_every_n_epochs = gr.Slider(
                minimum=1,
                maximum=1000,
                step=1,
                value=10,
                label=t("training.save_every_n_epochs"),
            )
            training_shift = gr.Slider(
                minimum=1.0,
                maximum=5.0,
                step=0.5,
                value=3.0,
                label=t("training.shift"),
                info=t("training.shift_info"),
                elem_classes=["has-info-container"],
            )
            training_seed = gr.Number(
                label=t("training.seed"),
                value=42,
                precision=0,
            )
        with gr.Row():
            lora_output_dir = gr.Textbox(
                label=t("training.output_dir"),
                value="./lora_output",
                placeholder="./lora_output",
                info=t("training.output_dir_info"),
                elem_classes=["has-info-container"],
            )
        with gr.Row():
            resume_checkpoint_dir = gr.Textbox(
                label="Resume Checkpoint",
                placeholder="./lora_output/checkpoints/epoch_200",
                info="Directory of a saved LoRA checkpoint to resume from",
                elem_classes=["has-info-container"],
            )
        gr.HTML("<hr>")
        with gr.Row():
            with gr.Column(scale=1):
                start_training_btn = gr.Button(
                    t("training.start_training_btn"),
                    variant="primary",
                    size="lg",
                )
            with gr.Column(scale=1):
                stop_training_btn = gr.Button(
                    t("training.stop_training_btn"),
                    variant="stop",
                    size="lg",
                )
        training_progress = gr.Textbox(
            label=t("training.training_progress"),
            interactive=False,
            lines=2,
        )
        with gr.Row():
            training_log = gr.Textbox(
                label=t("training.training_log"),
                interactive=False,
                lines=10,
                max_lines=15,
                scale=1,
            )
            training_loss_plot = gr.Plot(
                label=t("training.training_loss_title"),
                scale=1,
            )
        gr.HTML(f"<hr><h3>📦 {t('training.export_header')}</h3>")
        with gr.Row():
            export_path = gr.Textbox(
                label=t("training.export_path"),
                value="./lora_output/final_lora",
                placeholder="./lora_output/my_lora",
            )
            export_lora_btn = gr.Button(
                t("training.export_lora_btn"), variant="secondary"
            )
        export_status = gr.Textbox(
            label=t("training.export_status"),
            interactive=False,
        )
        return {
            "learning_rate": learning_rate,
            "train_epochs": train_epochs,
            "train_batch_size": train_batch_size,
            "gradient_accumulation": gradient_accumulation,
            "save_every_n_epochs": save_every_n_epochs,
            "training_shift": training_shift,
            "training_seed": training_seed,
            "lora_output_dir": lora_output_dir,
            "resume_checkpoint_dir": resume_checkpoint_dir,
            "start_training_btn": start_training_btn,
            "stop_training_btn": stop_training_btn,
            "training_progress": training_progress,
            "training_log": training_log,
            "training_loss_plot": training_loss_plot,
            "export_path": export_path,
            "export_lora_btn": export_lora_btn,
            "export_status": export_status,
        }

    run_module.build_lora_run_and_export_controls = patched_run

    original_training_section = training_module.create_training_section

    @wraps(original_training_section)
    def patched_training_section(dit_handler, llm_handler, init_params=None) -> dict:
        import gradio as gr
        from acestep.ui.gradio.interfaces.training_dataset_builder_tab import (
            create_dataset_builder_tab,
        )
        from acestep.ui.gradio.interfaces.training_lora_tab import create_training_lora_tab

        epoch_min, epoch_step, epoch_default = patched_epoch_defaults()
        gr.HTML(
            f"""
        <div style="text-align: center; padding: 12px 10px 18px; margin-bottom: 18px;">
            <h2 style="letter-spacing: 0.12em; text-transform: uppercase; text-shadow: 0 0 18px rgba(124, 77, 255, 0.35);">{presets.TRAINING_HEADER}</h2>
            <p style="color: #94a3c1; letter-spacing: 0.08em;">构建数据集 · 训练 LoRA · 导出适配器</p>
        </div>
        """
        )
        training_section: dict[str, object] = {}
        with gr.Tabs():
            training_section.update(create_dataset_builder_tab())
            training_section.update(
                create_training_lora_tab(
                    epoch_min=epoch_min,
                    epoch_step=epoch_step,
                    epoch_default=epoch_default,
                )
            )
            if not presets.HIDE_LOKR_TAB:
                from acestep.ui.gradio.interfaces.training_lokr_tab import (
                    create_training_lokr_tab,
                )

                training_section.update(create_training_lokr_tab())
            dataset_builder_state = gr.State(None)
            training_state = gr.State({"is_training": False, "should_stop": False})
            training_section.update(
                {
                    "dataset_builder_state": dataset_builder_state,
                    "training_state": training_state,
                }
            )
        return training_section

    training_module.create_training_section = patched_training_section


def _patch_blocks_theme() -> None:
    healing_css = _load_healing_css()
    original_init = gr.Blocks.__init__

    @wraps(original_init)
    def patched_init(self, *args, **kwargs):
        kwargs.setdefault("theme", _healing_theme())
        if kwargs.get("css"):
            kwargs["css"] = kwargs["css"] + "\n" + healing_css
        else:
            kwargs["css"] = healing_css
        return original_init(self, *args, **kwargs)

    gr.Blocks.__init__ = patched_init


def _patch_header_guide() -> None:
    import acestep.ui.gradio.interfaces as iface_module

    original_create = iface_module.create_gradio_interface
    original_html = gr.HTML
    logo_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../../assets/acemusic-logo.svg")
    )

    class GuideHTML:
        def __init__(self):
            self._guide_injected = False

        def __call__(self, value="", **kw):
            if not self._guide_injected and "main-header" in str(value):
                self._guide_injected = True
                value = value + f"""
                <div class="healing-guide">
                    <strong>使用提示</strong><br>
                    1. 先在「设置」中初始化服务（模型：<code>{presets.DEFAULT_CONFIG_PATH}</code>）<br>
                    2. Simple 模式用自然语言描述场景；Custom 模式可编辑正向提示词<br>
                    3. 负向提示词参考：<code>{presets.NEGATIVE_PROMPT_TEMPLATE[:80]}…</code><br>
                    4. LoRA 微调请切换到「LoRA 微调」标签页<br>
                    5. 品牌标识位于 <code>{os.path.basename(logo_path)}</code>
                </div>
                """
            return original_html(value, **kw)

    @wraps(original_create)
    def patched_create_with_guide(*args, **kwargs):
        guide = GuideHTML()
        gr.HTML = guide  # type: ignore[misc, assignment]
        try:
            return original_create(*args, **kwargs)
        finally:
            gr.HTML = original_html  # type: ignore[misc, assignment]

    iface_module.create_gradio_interface = patched_create_with_guide


_applied = False


def apply_healing_patches() -> None:
    """Apply all healing UI patches once."""
    global _applied
    if _applied:
        return
    _patch_i18n()
    _patch_generation_modes()
    _patch_optional_controls()
    _patch_simple_controls()
    _patch_custom_controls()
    _patch_training_defaults()
    _patch_blocks_theme()
    _patch_header_guide()
    _applied = True
