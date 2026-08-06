import Image from "next/image";
import Link from "next/link";

interface LiloLogoProps {
  variant?: "default" | "light";
}

export function LiloLogo({ variant = "default" }: LiloLogoProps) {
  const imageClass =
    variant === "light"
      ? "h-12 w-auto max-w-[200px] object-contain object-left invert mix-blend-screen sm:h-14"
      : "h-12 w-auto object-contain sm:h-14";

  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="LILO S.R.L. — Home">
      <Image
        src="/logo-lilo.jpg"
        alt="LILO S.R.L. — Autonoleggio e servizi a Trieste"
        width={180}
        height={56}
        className={imageClass}
        style={{ width: "auto", height: "auto" }}
        priority={variant === "default"}
      />
    </Link>
  );
}
