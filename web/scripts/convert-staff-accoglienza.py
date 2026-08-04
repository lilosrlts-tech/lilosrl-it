"""Convert staff photo to WebP with GPS at Viale Campi Elisi 38/B."""
from pathlib import Path

import piexif
from PIL import Image
from PIL.ExifTags import GPSTAGS, IFD

SRC = Path(
    r"C:\Users\info\.cursor\projects\c-Users-info-Progetti-lilosrl-it\assets"
    r"\c__Users_info_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"75433f55960a06a9662acd4ce64c2b92_images_IMG_5957-5277e856-4e3f-41f7-9ce8-5e2fc5cbbeed.png"
)
OUT = Path(__file__).resolve().parents[1] / "public" / "images" / "lilo-staff-accoglienza-trieste.webp"

# Same GPS as flotta photos: ~45°38'57.66" N, 13°46'37.02" E
LAT = (45.0, 38.0, 57.66)
LON = (13.0, 46.0, 37.02)


def rational(x: float) -> tuple[int, int]:
    if isinstance(x, float):
        return (int(round(x * 100)), 100)
    return (int(x), 1)


def main() -> None:
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
            piexif.ImageIFD.ImageDescription: (
                "LILO Autonoleggio Trieste — desk accoglienza Viale Campi Elisi 38/B".encode(
                    "utf-8"
                )
            ),
            piexif.ImageIFD.Software: b"LILO web",
        },
        "Exif": {},
        "GPS": gps_ifd,
        "1st": {},
        "thumbnail": None,
    }
    exif_bytes = piexif.dump(exif_dict)

    im = Image.open(SRC).convert("RGB")
    w, h = im.size
    max_w = 1600
    if w > max_w:
        nh = int(h * max_w / w)
        im = im.resize((max_w, nh), Image.Resampling.LANCZOS)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, "WEBP", quality=85, method=6, exif=exif_bytes)
    print("saved", OUT, im.size, OUT.stat().st_size)

    v = Image.open(OUT)
    ex = v.getexif()
    gps = ex.get_ifd(IFD.GPSInfo)
    print({GPSTAGS.get(k, k): val for k, val in gps.items()})


if __name__ == "__main__":
    main()
