import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { GOOGLE_PHONE_CSS_CLASS } from "@/lib/google-config";
import { telefonoE164 } from "@/lib/impostazioni";

export interface PhoneLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  phone: string;
  children?: ReactNode;
}

/** Link tel: nativo (+39...) con classe per Google Ads call tracking. */
export function PhoneLink({ phone, className, children, ...props }: PhoneLinkProps) {
  const href = `tel:${telefonoE164(phone)}`;
  const classes = [GOOGLE_PHONE_CSS_CLASS, className].filter(Boolean).join(" ");

  return (
    <a href={href} className={classes || undefined} {...props}>
      {children ?? phone}
    </a>
  );
}

export function phoneTelHref(phone: string): string {
  return `tel:${telefonoE164(phone)}`;
}

export function googlePhoneClass(className?: string): string {
  return [GOOGLE_PHONE_CSS_CLASS, className].filter(Boolean).join(" ");
}
