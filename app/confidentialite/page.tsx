import { LegalPageLayout, LegalSection } from '@/components/ui/LegalPageLayout';

export const metadata = {
  title: 'Politique de confidentialité — ContractClear',
};

export default function ConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      updated="19 septembre 2026"
    >
      <p className="prose-body">
        Cette politique explique quelles données ContractClear collecte,
        pourquoi, et comment les faire supprimer. Elle s&apos;applique à
        tous les visiteurs et utilisateurs du site.
      </p>

      <LegalSection title="1. Responsable du traitement">
        <p>
          Léon PELE, agissant à titre particulier, 6 rue de Soulbary, 44630
          Plessé, France —{' '}
          <a
            href="mailto:contractclearcontact@gmail.com"
            className="text-primary hover:text-primary-hover"
          >
            contractclearcontact@gmail.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Compte</strong> : adresse e-mail, mot de passe (haché,
            jamais accessible en clair) ou identifiant Google si vous vous
            connectez via Google.
          </li>
          <li>
            <strong>Usage</strong> : plan, nombre d&apos;analyses
            consommées, statut d&apos;abonnement.
          </li>
          <li>
            <strong>Contenu déposé</strong> : le texte des contrats que vous
            soumettez pour analyse, et un aperçu de ce texte conservé dans
            votre historique.
          </li>
          <li>
            <strong>Paiement</strong> : géré entièrement par Stripe — nous
            recevons uniquement la confirmation du paiement et un
            identifiant client Stripe, jamais votre numéro de carte.
          </li>
          <li>
            <strong>Événements produit</strong> : inscription, premier
            document déposé, analyse terminée, passage en caisse, et
            activation d&apos;un abonnement — utilisés uniquement en
            interne pour mesurer l&apos;usage du service, jamais partagés.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalités et base légale">
        <ul className="list-disc pl-5 space-y-1">
          <li>Fournir le service d&apos;analyse et gérer votre compte — exécution du contrat.</li>
          <li>Traiter les paiements et abonnements — exécution du contrat.</li>
          <li>Mesurer l&apos;usage du service pour l&apos;améliorer — intérêt légitime.</li>
          <li>Répondre à vos demandes de support — intérêt légitime.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Destinataires des données (sous-traitants)">
        <p>Vos données sont partagées uniquement avec les prestataires nécessaires au fonctionnement du service :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Supabase</strong> (authentification et base de
            données) — les serveurs de ce projet sont situés à Singapour,
            en dehors de l&apos;Union européenne. Ce transfert est encadré
            par les Clauses Contractuelles Types de la Commission
            européenne (Décision 2021/914, Module 2 « responsable de
            traitement vers sous-traitant »), intégrées de plein droit au
            contrat conclu avec Supabase Pte. Ltd dès l&apos;acceptation de
            ses conditions générales.
          </li>
          <li>
            <strong>OpenAI</strong> (États-Unis) — reçoit le texte de vos
            contrats pour produire l&apos;analyse. OpenAI n&apos;utilise
            pas les données envoyées via l&apos;API pour entraîner ses
            modèles.
          </li>
          <li>
            <strong>Stripe</strong> — traite les paiements et abonnements.
          </li>
          <li>
            <strong>Vercel</strong> — héberge l&apos;application, et fournit
            une mesure d&apos;audience anonyme et sans cookies (Vercel Web
            Analytics).
          </li>
          <li>
            <strong>PostHog</strong> (hébergement UE) — mesure détaillée de
            l&apos;usage (pages visitées, clics, replay de session) pour
            améliorer l&apos;interface. Chargé uniquement après votre
            consentement via la bannière de cookies ; le texte de vos
            contrats et les résultats d&apos;analyse sont techniquement
            exclus de cette mesure.
          </li>
        </ul>
        <p>Aucune donnée n&apos;est vendue à des tiers.</p>
      </LegalSection>

      <LegalSection title="5. Durée de conservation">
        <p>
          Vos données de compte et votre historique d&apos;analyses sont
          conservés tant que votre compte existe. Sur demande de
          suppression, votre compte et les données associées sont effacés
          dans un délai raisonnable, sauf obligation légale de
          conservation plus longue (ex. données de facturation).
        </p>
      </LegalSection>

      <LegalSection title="6. Sécurité">
        <p>
          Les accès à votre profil et à votre historique sont protégés par
          des règles de sécurité au niveau des lignes (RLS) dans la base de
          données : seul votre compte peut lire ses propres données. Les
          clés d&apos;accès aux services tiers (OpenAI, Stripe, Supabase)
          ne sont jamais exposées côté navigateur.
        </p>
      </LegalSection>

      <LegalSection title="7. Vos droits">
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit
          d&apos;accès, de rectification, d&apos;effacement, de limitation,
          d&apos;opposition et de portabilité sur vos données. Pour
          l&apos;exercer, écrivez à{' '}
          <a
            href="mailto:contractclearcontact@gmail.com"
            className="text-primary hover:text-primary-hover"
          >
            contractclearcontact@gmail.com
          </a>
          . Vous pouvez aussi introduire une réclamation auprès de la CNIL
          (
          <a
            href="https://www.cnil.fr"
            className="text-primary hover:text-primary-hover"
            target="_blank"
            rel="noopener noreferrer"
          >
            cnil.fr
          </a>
          ).
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Le site utilise un cookie de session strictement nécessaire à
          l&apos;authentification (Supabase Auth) ; celui-ci ne nécessite
          pas de consentement. Vercel Web Analytics ne dépose aucun cookie
          et ne collecte aucune donnée personnelle identifiable.
        </p>
        <p>
          PostHog (mesure de clics et replay de session) dépose un cookie
          non essentiel et n&apos;est activé qu&apos;après votre accord via
          la bannière affichée à votre première visite. Vous pouvez refuser
          sans que cela affecte l&apos;usage du service, et changer d&apos;avis
          en effaçant les données de ce site dans votre navigateur.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
