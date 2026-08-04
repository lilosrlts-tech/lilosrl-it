import { AutolavaggioPromoSection } from "@/components/home/AutolavaggioPromoSection";
import { ContactMapSection } from "@/components/home/ContactMapSection";
import { InstitutionalPartnersSection } from "@/components/home/InstitutionalPartnersSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { StaffAccoglienzaSection } from "@/components/home/StaffAccoglienzaSection";
import { StrengthsSection } from "@/components/home/StrengthsSection";
import type { ImpostazioniSito } from "@/types/impostazioni";

interface HomeBelowFoldSectionsProps {
  impostazioni: ImpostazioniSito;
}

/** Sezioni sotto la piega — caricate in chunk separato per ridurre JS iniziale. */
export function HomeBelowFoldSections({ impostazioni }: HomeBelowFoldSectionsProps) {
  return (
    <>
      <StaffAccoglienzaSection />
      <AutolavaggioPromoSection />
      <InstitutionalPartnersSection />
      <StrengthsSection impostazioni={impostazioni} />
      <ReviewsSection />
      <ContactMapSection impostazioni={impostazioni} />
    </>
  );
}
