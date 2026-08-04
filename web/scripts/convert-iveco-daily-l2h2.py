"""Convert Iveco Daily L2H2 Canon shots to JPG (+ WebP) with GPS Campi Elisi."""
from pathlib import Path

import piexif
from PIL import Image
from PIL.ExifTags import GPSTAGS, IFD

ASSETS = Path(r"C:\Users\info\.cursor\projects\c-Users-info-Progetti-lilosrl-it\assets")
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "images" / "flotta"

# IMG_5963 = front, IMG_5965 = rear (from filenames in assets)
FRONT_SRC = next(ASSETS.glob("*IMG_5963*"))
REAR_SRC = next(ASSETS.glob("*IMG_5965*"))

LAT = (45.0, 38.0, 57.66)
LON = (13.0, 46.0, 37.02)
ALT_TEXT = "Noleggio Furgone Grande Iveco Daily L2H2 a Trieste - Lilo SRL"


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
        },
        "Exif": {},
        "GPS": gps_ifd,
        "1st": {},
        "thumbnail": None,
    }
    return piexif.dump(exif_dict)


def convert(src: Path, stem: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    w, h = im.size
    max_w = 1600
    if w > max_w:
        nh = int(h * max_w / w)
        im = im.resize((max_w, nh), Image.Resampling.LANCZOS)

    desc = f"{ALT_TEXT} — Viale Campi Elisi 38/B"
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
    print("front", FRONT_SRC.name)
    print("rear", REAR_SRC.name)
    convert(FRONT_SRC, "furgone-grande-iveco-daily-l2h2-trieste-front")
    convert(REAR_SRC, "furgone-grande-iveco-daily-l2h2-trieste-rear")


if __name__ == "__main__":
    main()
