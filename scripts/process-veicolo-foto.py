"""Converte foto veicolo originali in WebP — senza rimozione sfondo IA."""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "web" / "public" / "images" / "veicoli"
ASSETS = Path(
    r"C:\Users\info\.cursor\projects\c-Users-info-GestionaleContabilita\assets"
)


def convert_photo(input_path: Path, output_path: Path, max_width: int = 1600) -> None:
    img = Image.open(input_path)
    img = ImageOps.exif_transpose(img).convert("RGB")

    if img.width > max_width:
        scale = max_width / img.width
        img = img.resize(
            (max_width, int(img.height * scale)),
            Image.Resampling.LANCZOS,
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, format="WEBP", quality=90, method=6)
    print(f"OK {output_path} ({img.width}x{img.height})")


def main() -> None:
    jobs = [
        (
            ASSETS
            / "c__Users_info_AppData_Roaming_Cursor_User_workspaceStorage_52b29e8af6333b4a1d44d4be29dd50ca_images_veicolo-flotta-16-6583e1fc-586b-4009-a77f-f1fc494d12c7.png",
            OUT_DIR / "citroen-jumpy-fr523sw-fiancata.webp",
        ),
        (
            ASSETS
            / "c__Users_info_AppData_Roaming_Cursor_User_workspaceStorage_52b29e8af6333b4a1d44d4be29dd50ca_images_veicolo-flotta-17-9b5be0fe-2e5a-4b0e-916f-01d70f55cf81.png",
            OUT_DIR / "citroen-jumpy-fr523sw-posteriore.webp",
        ),
    ]

    for src, dst in jobs:
        if not src.exists():
            print(f"MISSING {src}", file=sys.stderr)
            sys.exit(1)
        convert_photo(src, dst)

    cover = OUT_DIR / "citroen-jumpy-fr523sw-copertina.webp"
    cover.write_bytes((OUT_DIR / "citroen-jumpy-fr523sw-fiancata.webp").read_bytes())

    # Alias con nome originale per riferimento interno
    alias = OUT_DIR / "veicolo-flotta-16.webp"
    alias.write_bytes(cover.read_bytes())
    print(f"OK {cover}")
    print(f"OK {alias}")


if __name__ == "__main__":
    main()
