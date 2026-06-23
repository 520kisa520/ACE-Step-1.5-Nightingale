"""Launch the healing-themed Gradio UI for ACE-Step."""

from __future__ import annotations

import sys

from acestep.ui.gradio_healing.patches import apply_healing_patches
from acestep.ui.gradio_healing import presets


def _inject_default_cli_args(argv: list[str]) -> list[str]:
    """Append healing defaults when equivalent flags are absent."""
    out = list(argv)
    pairs = [
        ("--language", presets.DEFAULT_LANGUAGE),
        ("--config_path", presets.DEFAULT_CONFIG_PATH),
    ]
    for flag, value in pairs:
        if flag not in out and flag.replace("_", "-") not in out:
            out.extend([flag, value])
    return out


def main() -> None:
    apply_healing_patches()
    sys.argv = _inject_default_cli_args(sys.argv)
    from acestep.acestep_v15_pipeline import main as pipeline_main

    pipeline_main()


if __name__ == "__main__":
    main()
