import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LILO Admin — Flotta autonoleggio",
  description: "Pannello di gestione flotta LILO S.r.l.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
