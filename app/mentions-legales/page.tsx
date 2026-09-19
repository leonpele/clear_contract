import { LegalPageLayout, LegalSection } from '@/components/ui/LegalPageLayout';

export const metadata = {
  title: 'Mentions légales — ContractClear',
};

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout title="Mentions légales" updated="19 septembre 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site ContractClear est édité par Léon PELE, personne physique
          agissant à titre particulier (non-immatriculé au Registre du
          Commerce et des Sociétés).
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Adresse : 6 rue de Soulbary, 44630 Plessé, France</li>
          <li>
            E-mail :{' '}
            <a
              href="mailto:contractclearcontact@gmail.com"
              className="text-primary hover:text-primary-hover"
            >
              contractclearcontact@gmail.com
            </a>
          </li>
        </ul>
        <p>Directeur de la publication : Léon PELE.</p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
          CA 91789, États-Unis —{' '}
          <a
            href="https://vercel.com"
            className="text-primary hover:text-primary-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            vercel.com
          </a>
          .
        </p>
        <p>
          La base de données et l&apos;authentification sont hébergées par
          Supabase (Supabase Inc.) —{' '}
          <a
            href="https://supabase.com"
            className="text-primary hover:text-primary-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            supabase.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          La structure du site, son design, ses textes, et sa marque
          &quot;ContractClear&quot; sont la propriété de l&apos;éditeur, sauf
          mention contraire. Toute reproduction ou représentation, totale ou
          partielle, sans autorisation préalable, est interdite.
        </p>
        <p>
          Les documents que vous déposez pour analyse restent votre
          propriété exclusive ; l&apos;éditeur ne revendique aucun droit sur
          leur contenu.
        </p>
      </LegalSection>

      <LegalSection title="Responsabilité">
        <p>
          ContractClear utilise un modèle d&apos;intelligence artificielle
          pour produire une analyse automatisée de documents contractuels.
          Cette analyse est fournie à titre informatif uniquement et ne
          constitue en aucun cas un conseil juridique. Voir l&apos;
          <a
            href="/cgu#avertissement"
            className="text-primary hover:text-primary-hover"
          >
            avertissement détaillé
          </a>
          .
        </p>
        <p>
          L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des
          informations diffusées sur le site mais ne peut garantir
          l&apos;absence d&apos;erreur ou d&apos;interruption de service.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes mentions légales sont soumises au droit français. En
          cas de litige, et à défaut de résolution amiable, les tribunaux de
          Nantes seront seuls compétents.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative au site, écrivez à{' '}
          <a
            href="mailto:contractclearcontact@gmail.com"
            className="text-primary hover:text-primary-hover"
          >
            contractclearcontact@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
