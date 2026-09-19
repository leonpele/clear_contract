import { LegalPageLayout, LegalSection } from '@/components/ui/LegalPageLayout';
import { PRICING_PLANS } from '@/lib/stripe';

export const metadata = {
  title: 'CGU / CGV — ContractClear',
};

export default function CguCgvPage() {
  return (
    <LegalPageLayout
      title="Conditions générales d'utilisation et de vente"
      updated="19 septembre 2026"
    >
      <p className="prose-body">
        Les présentes conditions régissent l&apos;accès et l&apos;usage du
        service ContractClear, édité par Léon PELE (voir les{' '}
        <a
          href="/mentions-legales"
          className="text-primary hover:text-primary-hover"
        >
          mentions légales
        </a>
        ). En créant un compte ou en utilisant le service, vous acceptez sans
        réserve l&apos;intégralité des présentes conditions.
      </p>

      <section
        id="avertissement"
        className="rounded-xl border border-risk-high-border bg-risk-high-bg p-5 space-y-2"
      >
        <h2 className="text-risk-high">
          Avertissement — Ceci n&apos;est pas un conseil juridique
        </h2>
        <div className="prose-body space-y-2 text-ink-secondary">
          <p>
            ContractClear analyse vos documents à l&apos;aide d&apos;un
            modèle d&apos;intelligence artificielle (fourni par OpenAI). Les
            résultats produits — résumé, score de risque, clauses signalées
            comme risquées ou favorables, chiffres clés — sont générés de
            façon automatisée et peuvent contenir des erreurs, des
            omissions ou des interprétations inexactes.
          </p>
          <p>
            Ce service ne remplace pas la consultation d&apos;un avocat ou
            d&apos;un professionnel du droit qualifié, et ne crée aucune
            relation avocat-client. Avant de signer, résilier ou vous
            engager sur la base d&apos;un contrat analysé, faites vérifier
            les points importants par un professionnel qualifié.
            L&apos;éditeur ne pourra être tenu responsable des décisions
            prises sur la seule base des résultats fournis par le service.
          </p>
        </div>
      </section>

      <div className="pt-2">
        <span className="label-caps">Partie 1</span>
        <h2 className="mt-1">Conditions générales d&apos;utilisation (CGU)</h2>
      </div>

      <LegalSection title="1. Objet">
        <p>
          ContractClear est un service en ligne permettant de déposer un
          contrat (fichier PDF ou texte collé) et d&apos;en obtenir une
          analyse automatisée en langage clair : résumé, score de risque,
          clauses risquées et favorables, et chiffres clés (montants, dates,
          durées).
        </p>
      </LegalSection>

      <LegalSection title="2. Accès au service et compte">
        <p>
          L&apos;utilisation du service nécessite la création d&apos;un
          compte (e-mail et mot de passe, ou connexion via Google). Vous
          êtes responsable de la confidentialité de vos identifiants et de
          toute activité effectuée depuis votre compte.
        </p>
        <p>
          Le service est réservé aux personnes capables de conclure un
          contrat valablement au regard du droit français.
        </p>
      </LegalSection>

      <LegalSection title="3. Formules d'accès">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Gratuit</strong> : 3 analyses par mois civil, incluses
            par défaut sur tout compte.
          </li>
          <li>
            <strong>{PRICING_PLANS.oneTime.name}</strong> — {PRICING_PLANS.oneTime.description}, en paiement unique.
          </li>
          <li>
            <strong>{PRICING_PLANS.subscription.name}</strong> —{' '}
            {PRICING_PLANS.subscription.description}, en abonnement mensuel
            reconductible.
          </li>
        </ul>
        <p>Voir le détail des tarifs dans la Partie 2 (CGV).</p>
      </LegalSection>

      <LegalSection title="4. Obligations de l'utilisateur">
        <p>Vous vous engagez à :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            ne déposer que des documents que vous êtes autorisé à
            communiquer et à faire analyser (les vôtres, ou ceux d&apos;un
            tiers avec son accord) ;
          </li>
          <li>
            ne pas utiliser le service à des fins illicites ou pour
            analyser du contenu portant atteinte aux droits d&apos;un
            tiers ;
          </li>
          <li>ne pas tenter de contourner les quotas ou la sécurité du service.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Disponibilité du service">
        <p>
          L&apos;éditeur met en œuvre des moyens raisonnables pour assurer
          l&apos;accessibilité du service, sans garantie de continuité
          absolue. Le service peut être interrompu pour maintenance ou en
          cas de panne d&apos;un prestataire tiers (hébergement, IA,
          paiement).
        </p>
      </LegalSection>

      <LegalSection title="6. Résiliation du compte">
        <p>
          Vous pouvez cesser d&apos;utiliser le service à tout moment et
          demander la suppression de votre compte en écrivant à{' '}
          <a
            href="mailto:contractclearcontact@gmail.com"
            className="text-primary hover:text-primary-hover"
          >
            contractclearcontact@gmail.com
          </a>
          . L&apos;éditeur peut suspendre ou clore un compte en cas de
          manquement grave aux présentes conditions.
        </p>
      </LegalSection>

      <div className="pt-4">
        <span className="label-caps">Partie 2</span>
        <h2 className="mt-1">Conditions générales de vente (CGV)</h2>
      </div>

      <LegalSection title="1. Prix">
        <p>
          Les prix affichés sur le site sont exprimés en euros, toutes
          taxes comprises. Le vendeur, personne physique non assujettie à
          la TVA, ne facture pas de TVA sur ses ventes.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Achat unique : {PRICING_PLANS.oneTime.price}€ — {PRICING_PLANS.oneTime.description}, sans engagement.
          </li>
          <li>
            Abonnement {PRICING_PLANS.subscription.name} :{' '}
            {PRICING_PLANS.subscription.price}€/mois — {PRICING_PLANS.subscription.description}, reconduit automatiquement chaque mois jusqu&apos;à résiliation.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Commande et paiement">
        <p>
          Le paiement s&apos;effectue en ligne par carte bancaire via
          Stripe, prestataire de paiement sécurisé. L&apos;éditeur ne
          collecte ni ne stocke vos données de carte bancaire. La commande
          est confirmée après validation du paiement par Stripe ; les
          crédits ou l&apos;accès illimité sont activés automatiquement sur
          votre compte.
        </p>
      </LegalSection>

      <LegalSection title="3. Droit de rétractation">
        <p>
          Conformément à l&apos;article L221-28 13° du Code de la
          consommation, le droit de rétractation ne s&apos;applique pas à
          la fourniture d&apos;un contenu numérique non fourni sur un
          support matériel dont l&apos;exécution a commencé après votre
          accord préalable exprès. En validant votre achat, vous demandez
          l&apos;exécution immédiate du service (déblocage immédiat des
          crédits ou de l&apos;accès illimité) et renoncez expressément à
          votre droit de rétractation.
        </p>
      </LegalSection>

      <LegalSection title="4. Résiliation de l'abonnement">
        <p>
          L&apos;abonnement {PRICING_PLANS.subscription.name} est sans
          engagement de durée et peut être résilié à tout moment en
          écrivant à{' '}
          <a
            href="mailto:contractclearcontact@gmail.com"
            className="text-primary hover:text-primary-hover"
          >
            contractclearcontact@gmail.com
          </a>
          . La résiliation prend effet à la fin de la période de
          facturation en cours ; aucun remboursement au prorata n&apos;est
          effectué pour la période déjà entamée.
        </p>
      </LegalSection>

      <LegalSection title="5. Réclamations">
        <p>
          Pour toute réclamation relative à une commande, contactez{' '}
          <a
            href="mailto:contractclearcontact@gmail.com"
            className="text-primary hover:text-primary-hover"
          >
            contractclearcontact@gmail.com
          </a>
          . À défaut de résolution amiable, le litige pourra être soumis
          aux tribunaux compétents de Nantes, le droit français étant seul
          applicable.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
