import { AdminShell } from "@/components/admin/AdminShell";
import { GestioneContenutiForm } from "@/components/admin/GestioneContenutiForm";

export default function ImpostazioniAdminPage() {
  return (
    <AdminShell
      title="Gestione Contenuti / Impostazioni"
      subtitle="Contatti, testi delle pagine e ottimizzazione SEO"
    >
      <GestioneContenutiForm />
    </AdminShell>
  );
}
