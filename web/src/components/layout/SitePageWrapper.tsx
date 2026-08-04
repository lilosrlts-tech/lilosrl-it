import type { ImpostazioniSito } from "@/types/impostazioni";
import { getImpostazioniSito } from "@/lib/impostazioni";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

interface SitePageWrapperProps {
  children: React.ReactNode;
  impostazioni?: ImpostazioniSito;
}

export async function SitePageWrapper({ children, impostazioni }: SitePageWrapperProps) {
  const settings = impostazioni ?? (await getImpostazioniSito());

  return (
    <>
      <SiteHeader impostazioni={settings} />
      {children}
      <SiteFooter impostazioni={settings} />
    </>
  );
}

export async function loadImpostazioni(): Promise<ImpostazioniSito> {
  return getImpostazioniSito();
}
