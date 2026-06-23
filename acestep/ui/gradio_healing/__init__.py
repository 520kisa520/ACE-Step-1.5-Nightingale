"""Healing / meditation instrumental music UI profile for ACE-Step Gradio."""

from acestep.ui.gradio_healing.patches import apply_healing_patches

__all__ = ["apply_healing_patches", "main"]


def main() -> None:
    from acestep.ui.gradio_healing.launch import main as _launch_main

    _launch_main()
