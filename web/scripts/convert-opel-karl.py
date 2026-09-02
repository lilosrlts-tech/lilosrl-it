"""Convert Opel Karl Rocks real photos to WebP (+ JPG) with GPS Campi Elisi."""
from pathlib import Path

import piexif
from PIL import Image
from PIL.ExifTags import GPSTAGS, IFD

ASSETS = Path(r"C:\Users\info\.cursor\projects\c-Users-info-Progetti-lilosrl-it\assets")
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "images" / "veicoli"

# Mapping sorgente → stem file pubblico
SHOTS = [
    ("*IMG_6121*", "opel-karl-noleggio-auto-trieste", "frontale"),
    ("*IMG_6117*", "opel-karl-retro-trieste", "posteriore"),
    ("*IMG_6114*", "opel-karl-interni-guida", "interni-guida"),
    ("*IMG_6115*", "opel-karl-interni-posteriori", "interni-posteriori"),
    ("*IMG_6116*", "opel-karl-bagagliaio-trieste", "bagagliaio"),
]

LAT = (45.0, 38.0, 57.66)
LON = (13.0, 46.0, 37.02)

ALT_BY_KIND = {
    "frontale": (
        "Noleggio autovettura Opel Karl Rocks grigio scuro con barre sul tetto "
        "a Trieste presso LILO Autonoleggio in Viale Campi Elisi 38/b"
    ),
    "posteriore": (
        "Vista posteriore Opel Karl Rocks grigio scuro con barre portatutto "
        "per noleggio auto a Trieste — LILO Autonoleggio"
    ),
    "interni-guida": (
        "Interni e posto guida Opel Karl Rocks — noleggio auto city-car a Trieste"
    ),
    "interni-posteriori": (
        "Sedili posteriori Opel Karl Rocks a 5 posti — noleggio auto Trieste LILO"
    ),
    "bagagliaio": (
        "Bagagliaio Opel Karl Rocks — noleggio auto compatta a Trieste presso LILO"
    ),
}


def rational(x: float) -> tuple[int, int]:
    if isinstance(x, float):
        return (int(round(x * 100)), 100)
    return (int(x), 1)


def exif_bytes(description: str) -> bytes:
    gps_ifd = {
        piexif.GPSIFD.GPSVersionID: (2, 0, 0, 0),
        piexif.GPSIFD.GPSLatitudeRef: b"N",
        piexif.GPSIFD.GPSLatitude: (
            rational(LAT[0]),
            rational(LAT[1]),
            (int(round(LAT[2] * 100)), 100),
        ),
        piexif.GPSIFD.GPSLongitudeRef: b"E",
        piexif.GPSIFD.GPSLongitude: (
            rational(LON[0]),
            rational(LON[1]),
            (int(round(LON[2] * 100)), 100),
        ),
        piexif.GPSIFD.GPSAltitudeRef: 0,
        piexif.GPSIFD.GPSAltitude: (300, 100),
    }
    exif_dict = {
        "0th": {
            piexif.ImageIFD.Make: b"Canon",
            piexif.ImageIFD.Model: b"EOS",
            piexif.ImageIFD.ImageDescription: description.encode("utf-8"),
            piexif.ImageIFD.Software: b"LILO web",
            piexif.ImageIFD.Artist: b"LILO S.r.l. Trieste",
            piexif.ImageIFD.Copyright: "LILO S.r.l. - Viale Campi Elisi 38/B, Trieste".encode(
                "utf-8"
            ),
        },
        "Exif": {},
        "GPS": gps_ifd,
        "1st": {},
        "thumbnail": None,
    }
    return piexif.dump(exif_dict)


def convert(src: Path, stem: str, kind: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    max_w = 1600
    if w > max_w:
        nh = int(h * max_w / w)
        im = im.resize((max_w, nh), Image.Resampling.LANCZOS)

    desc = f"{ALT_BY_KIND[kind]} — Viale Campi Elisi 38/B"
    exif = exif_bytes(desc)

    jpg = OUT_DIR / f"{stem}.jpg"
    webp = OUT_DIR / f"{stem}.webp"
    im.save(jpg, "JPEG", quality=88, optimize=True, exif=exif)
    im.save(webp, "WEBP", quality=85, method=6, exif=exif)
    print("saved", jpg.name, jpg.stat().st_size, im.size)
    print("saved", webp.name, webp.stat().st_size)

    v = Image.open(jpg)
    gps = v.getexif().get_ifd(IFD.GPSInfo)
    print("gps", {GPSTAGS.get(k, k): val for k, val in gps.items()})


def main() -> None:
    for pattern, stem, kind in SHOTS:
        matches = list(ASSETS.glob(pattern))
        if not matches:
            raise SystemExit(f"Missing asset for {pattern}")
        src = matches[0]
        print(kind, src.name)
        convert(src, stem, kind)


if __name__ == "__main__":
    main()
