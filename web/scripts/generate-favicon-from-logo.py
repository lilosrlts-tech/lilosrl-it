"""Estrae il simbolo verde circolare dal logo LILO e genera favicon + apple-touch-icon."""
from pathlib import Path

from PIL import Image, ImageFilter

SRC = Path(
    r"C:\Users\info\.cursor\projects\c-Users-info-Progetti-lilosrl-it\assets"
    r"\c__Users_info_AppData_Roaming_Cursor_User_workspaceStorage_75433f55960a06a9662acd4ce64c2b92_images_logo-footer-53eec1dc-2039-4d77-b321-3914e7c4a401.png"
)
OUT = Path(__file__).resolve().parents[1] / "public"


def is_logo_ink(r: int, g: int, b: int) -> bool:
    """Pixel del marchio (verde lime o anti-alias non bianco)."""
    if r > 245 and g > 245 and b > 245:
        return False
    # Verde brand
    if g >= 150 and g > r - 10 and g > b + 30:
        return True
    # Anti-alias verdastro / grigio-verde
    if g > 120 and g >= r and g > b and (g - b) > 20:
        return True
    return False


def extract_symbol(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size
    left_w = max(1, int(w * 0.55))
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(left_w):
            r, g, b = rgb.getpixel((x, y))
            if is_logo_ink(r, g, b):
                xs.append(x)
                ys.append(y)
    if not xs:
        raise SystemExit("Nessun pixel del simbolo trovato")

    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    pad = 3
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(w - 1, max_x + pad)
    max_y = min(h - 1, max_y + pad)

    crop_w = max_x - min_x + 1
    crop_h = max_y - min_y + 1
    side = max(crop_w, crop_h)
    cx = (min_x + max_x) / 2
    cy = (min_y + max_y) / 2
    left = int(round(cx - side / 2))
    top = int(round(cy - side / 2))
    left = max(0, min(left, w - side))
    top = max(0, min(top, h - side))
    right = min(w, left + side)
    bottom = min(h, top + side)

    cropped = rgb.crop((left, top, right, bottom)).convert("RGBA")
    pixels = cropped.load()
    assert pixels is not None
    for y in range(cropped.height):
        for x in range(cropped.width):
            r, g, b, _a = pixels[x, y]
            if r > 240 and g > 240 and b > 240:
                pixels[x, y] = (0, 0, 0, 0)
            elif not is_logo_ink(r, g, b) and r > 200 and g > 200 and b > 200:
                pixels[x, y] = (0, 0, 0, 0)
    return cropped


def resize_crisp(im: Image.Image, size: int) -> Image.Image:
    """Upscale progressivo (migliore su sorgenti piccoli)."""
    cur = im
    while max(cur.size) * 2 < size:
        nxt = (cur.width * 2, cur.height * 2)
        cur = cur.resize(nxt, Image.Resampling.LANCZOS)
    out = cur.resize((size, size), Image.Resampling.LANCZOS)
    # Leggero sharpen per compensare blur upscale
    return out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=2))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    symbol = extract_symbol(Image.open(SRC))
    print("symbol native", symbol.size)

    # Copia logo footer completo (WebP leggero) per riferimento futuro
    footer = Image.open(SRC).convert("RGBA")
    footer_path = OUT / "logo-footer.webp"
    footer.save(footer_path, format="WEBP", quality=90, method=6)
    print("saved", footer_path.name, footer_path.stat().st_size)

    icon32 = resize_crisp(symbol, 32)
    icon16 = resize_crisp(symbol, 16)
    ico_path = OUT / "favicon.ico"
    icon32.save(ico_path, format="ICO", sizes=[(32, 32), (16, 16)], append_images=[icon16])
    print("saved", ico_path.name, ico_path.stat().st_size)

    png32 = OUT / "favicon-32.png"
    icon32.save(png32, format="PNG", optimize=True)
    print("saved", png32.name, png32.stat().st_size)

    apple = resize_crisp(symbol, 180)
    apple_path = OUT / "apple-touch-icon.png"
    apple.save(apple_path, format="PNG", optimize=True)
    print("saved", apple_path.name, apple_path.stat().st_size)

    # Variante WebP leggera (stesso simbolo)
    webp_path = OUT / "icon-lilo.webp"
    apple.save(webp_path, format="WEBP", quality=88, method=6)
    print("saved", webp_path.name, webp_path.stat().st_size)


if __name__ == "__main__":
    main()
