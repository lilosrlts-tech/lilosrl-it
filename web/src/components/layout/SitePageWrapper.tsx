import type { ImpostazioniSito } from "@/types/impostazioni";
import { COMPANY } from "@/lib/constants";
import { getImpostazioniSito } from "@/lib/impostazioni";
import { formatPhoneDisplayIntl } from "@/lib/nap";
import { MobileCallButton } from "@/components/layout/MobileCallButton";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteChrome";

interface SitePageWrapperProps {
  children: React.ReactNode;
  impostazioni?: ImpostazioniSito;
}

export async function SitePageWrapper({ children, impostazioni }: SitePageWrapperProps) {
  const settings = impostazioni ?? (await getImpostazioniSito());
  const tel = settings.telefono_noleggio || COMPANY.phone;

  return (
    <>
      <SiteHeader impostazioni={settings} />
      <MobileCallButton phone={tel} phoneDisplay={formatPhoneDisplayIntl(tel)} />
      {children}
      <SiteFooter impostazioni={settings} />
    </>
  );
}

export async function loadImpostazioni(): Promise<ImpostazioniSito> {
  return getImpostazioniSito();
}
