"""Estrae il simbolo (solo cerchio) dal logo B/N hi-res, lo colora verde LILO e genera favicon."""
from pathlib import Path

from PIL import Image, ImageFilter

ASSETS = Path(r"C:\Users\info\.cursor\projects\c-Users-info-Progetti-lilosrl-it\assets")
SRC = next(ASSETS.glob("*Logo-d5771b9f*.png"))
OUT = Path(__file__).resolve().parents[1] / "public"

# Verde brand campionato dal logo colore LILO
BRAND_RGB = (122, 196, 75)


def ink_alpha(r: int, g: int, b: int) -> int:
    """0 = bianco, 255 = nero pieno (anti-alias)."""
    lum = (r + g + b) / 3
    if lum >= 250:
        return 0
    if lum <= 40:
        return 255
    # Interpolazione anti-alias
    t = (250 - lum) / (250 - 40)
    return max(0, min(255, int(round(t * 255))))


def extract_symbol(im: Image.Image) -> Image.Image:
    rgb = im.convert("RGB")
    w, h = rgb.size

    # Colonne con inchiostro (per trovare il gap simbolo → testo)
    col_ink = [0] * w
    for y in range(h):
        for x in range(w):
            r, g, b = rgb.getpixel((x, y))
            if ink_alpha(r, g, b) > 20:
                col_ink[x] += 1

    # Dopo il primo blocco di inchiostro (simbolo), cerca una colonna quasi vuota
    started = False
    cut_x = int(w * 0.4)
    for x in range(w):
        if col_ink[x] > 40:
            started = True
        elif started and col_ink[x] < 5:
            # finestra successiva prevalentemente vuota = gap verso il testo
            empty = sum(1 for i in range(x, min(w, x + 20)) if col_ink[i] < 8)
            if empty >= 15:
                cut_x = x
                break

    left_w = max(1, cut_x)
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(left_w):
            r, g, b = rgb.getpixel((x, y))
            if ink_alpha(r, g, b) > 20:
                xs.append(x)
                ys.append(y)
    if not xs:
        raise SystemExit("Nessun pixel del simbolo trovato")

    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    pad = 12
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(left_w - 1, max_x + pad)
    max_y = min(h - 1, max_y + pad)

    crop_w = max_x - min_x + 1
    crop_h = max_y - min_y + 1
    side = max(crop_w, crop_h)
    cx = (min_x + max_x) / 2
    cy = (min_y + max_y) / 2
    left = int(round(cx - side / 2))
    top = int(round(cy - side / 2))
    # Non oltrepassare il gap verso il testo
    if left + side > left_w:
        left = max(0, left_w - side)
    left = max(0, min(left, w - side))
    top = max(0, min(top, h - side))
    right = min(w, left + side)
    bottom = min(h, top + side)

    cropped = rgb.crop((left, top, right, bottom))
    side = max(cropped.size)
    out = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - cropped.width) // 2
    oy = (side - cropped.height) // 2

    rgba = Image.new("RGBA", cropped.size, (0, 0, 0, 0))
    px_in = cropped.load()
    px_out = rgba.load()
    assert px_in is not None and px_out is not None
    br, bg, bb = BRAND_RGB
    for y in range(cropped.height):
        for x in range(cropped.width):
            r, g, b = px_in[x, y]
            a = ink_alpha(r, g, b)
            if a > 0:
                px_out[x, y] = (br, bg, bb, a)

    out.paste(rgba, (ox, oy), rgba)
    print(f"cut_x={cut_x} crop=({left},{top},{right},{bottom}) side={side}")
    return out


def resize_crisp(im: Image.Image, size: int) -> Image.Image:
    cur = im
    while max(cur.size) * 2 < size:
        cur = cur.resize((cur.width * 2, cur.height * 2), Image.Resampling.LANCZOS)
    out = cur.resize((size, size), Image.Resampling.LANCZOS)
    if max(im.size) < size:
        out = out.filter(ImageFilter.UnsharpMask(radius=1.0, percent=90, threshold=2))
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("SRC", SRC.name)
    symbol = extract_symbol(Image.open(SRC))
    print("symbol native", symbol.size)

    # Master PNG ad alta risoluzione (solo simbolo)
    master = resize_crisp(symbol, max(512, symbol.size[0]))
    master_path = OUT / "icon-lilo-symbol.png"
    master.save(master_path, format="PNG", optimize=True)
    print("saved", master_path.name, master.size, master_path.stat().st_size)

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

    webp_path = OUT / "icon-lilo.webp"
    apple.save(webp_path, format="WEBP", quality=90, method=6)
    print("saved", webp_path.name, webp_path.stat().st_size)


if __name__ == "__main__":
    main()
