"""本地启动 ACE-Step 原版 Gradio UI（不初始化模型）。"""
from __future__ import annotations

import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from acestep.acestep_v15_pipeline import create_demo, get_gpu_config  # noqa: E402


def main() -> None:
    gpu_config = get_gpu_config()
    init_params = {
        "gpu_config": gpu_config,
        "language": "zh",
    }
    demo = create_demo(init_params=init_params, language="zh")
    demo.queue(max_size=20, default_concurrency_limit=1)
    demo.launch(
        server_name="127.0.0.1",
        server_port=int(os.environ.get("PORT", "7862")),
        show_error=True,
        inbrowser=True,
    )


if __name__ == "__main__":
    main()
