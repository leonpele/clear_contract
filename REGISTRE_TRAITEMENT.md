# Registre des activités de traitement — ContractClear

Document interne tenu en application de l'article 30 du RGPD. Ce n'est pas
une page publique : à conserver et à présenter en cas de contrôle (CNIL) ou
sur demande d'une autorité compétente. À tenir à jour à chaque changement
d'architecture (nouveau sous-traitant, nouvelle donnée collectée, etc.).

## Responsable du traitement

- **Nom** : Léon PELE, agissant à titre particulier
- **Adresse** : 6 rue de Soulbary, 44630 Plessé, France
- **Contact** : contractclearcontact@gmail.com
- **Délégué à la protection des données (DPO)** : non désigné (non
  obligatoire — le responsable ci-dessus fait office de point de contact)

## Sous-traitants

| Sous-traitant | Rôle | Localisation des serveurs | Données concernées |
|---|---|---|---|
| Supabase | Authentification, base de données (profils, historique, analytics) | Singapour (`ap-southeast-1`) — **hors UE** | Email, mot de passe (haché), profil, texte des contrats, historique, événements produit |
| OpenAI | Analyse IA du texte des contrats | États-Unis | Texte intégral des contrats soumis |
| Stripe | Paiement, gestion des abonnements | UE/États-Unis (infrastructure Stripe) | Email, identifiant client Stripe, statut de paiement — jamais le numéro de carte |
| Vercel | Hébergement de l'application, mesure d'audience anonyme | Réseau global (edge) | Requêtes HTTP, aucune donnée personnelle identifiable via l'analytics |

✅ Supabase étant hébergé hors UE (Singapour), le transfert est couvert par
les Clauses Contractuelles Types de la Commission européenne (Décision
2021/914), intégrées de plein droit au DPA Supabase dès l'acceptation des
conditions générales (clause 12.2 du DPA — pas de signature séparée
requise). Module applicable : Module 2 (responsable de traitement →
sous-traitant). Droit et juridiction des clauses : Irlande. Vérifié le
20/09/2026 en lisant le DPA complet
(https://supabase.com/legal/customer-resources/data-processing-addendum).

Reste un point d'attention théorique (post-arrêt *Schrems II*) : aucune
analyse d'impact de transfert (TIA) évaluant les lois de surveillance
singapouriennes n'a été formalisée. Non bloquant pour un projet de cette
taille, mais à documenter si le volume d'utilisateurs UE devient
significatif. Migrer vers une région UE nécessiterait de créer un nouveau
projet Supabase et de migrer les données — non fait à ce jour.

---

## Traitement 1 — Gestion des comptes utilisateurs

- **Finalité** : créer et administrer les comptes (authentification, accès au service)
- **Personnes concernées** : utilisateurs inscrits (particuliers)
- **Données traitées** : email, mot de passe (haché par Supabase Auth) ou identifiant Google (OAuth)
- **Base légale** : exécution du contrat (CGU)
- **Destinataires** : Supabase (hébergement Auth)
- **Durée de conservation** : durée de vie du compte ; suppression immédiate sur demande via `/account` ou par email
- **Mesures de sécurité** : mots de passe hachés, Row-Level Security (chaque utilisateur ne peut lire que ses propres données), clés de service jamais exposées au client

## Traitement 2 — Fourniture du service d'analyse de contrats

- **Finalité** : analyser un contrat déposé par l'utilisateur (résumé, score de risque, clauses à risque/favorables, chiffres clés)
- **Personnes concernées** : utilisateurs inscrits
- **Données traitées** : texte intégral du contrat déposé (peut contenir des données personnelles de tiers, ex. noms de parties au contrat), aperçu du contrat conservé en historique (500 premiers caractères), résultat de l'analyse
- **Base légale** : exécution du contrat (CGU)
- **Destinataires** : OpenAI (traitement du texte pour générer l'analyse), Supabase (stockage de l'historique)
- **Durée de conservation** : historique conservé tant que le compte existe ; supprimé avec le compte
- **Mesures de sécurité** : appel à l'API OpenAI effectué uniquement côté serveur (clé API jamais exposée) ; RLS sur la table d'historique

## Traitement 3 — Facturation et abonnements

- **Finalité** : traiter les paiements ponctuels et les abonnements Pro
- **Personnes concernées** : utilisateurs ayant effectué un achat
- **Données traitées** : email, identifiant client/abonnement Stripe, statut du paiement, plan souscrit — **jamais** le numéro de carte (géré exclusivement par Stripe)
- **Base légale** : exécution du contrat (CGV)
- **Destinataires** : Stripe
- **Durée de conservation** : durée de vie du compte ; les obligations comptables légales de Stripe s'appliquent indépendamment
- **Mesures de sécurité** : entitlements appliqués uniquement via le webhook Stripe signé (jamais depuis le client) ; clé secrète Stripe côté serveur uniquement

## Traitement 4 — Mesure d'usage produit (analytics interne)

- **Finalité** : mesurer l'activation, la rétention et l'usage du service (5 événements : inscription, premier document déposé, analyse terminée, passage en caisse, abonnement actif)
- **Personnes concernées** : utilisateurs inscrits
- **Données traitées** : identifiant de compte, type d'événement, horodatage, quelques propriétés techniques (ex. score de risque, type de plan)
- **Base légale** : intérêt légitime (amélioration du service)
- **Destinataires** : aucun destinataire externe — table interne (`analytics_events`) accessible uniquement via la clé de service, jamais exposée aux clients ni à des tiers
- **Durée de conservation** : durée de vie du compte ; supprimée avec le compte (cascade)
- **Mesures de sécurité** : aucune policy RLS n'autorise l'accès anonyme/authentifié à cette table ; lecture réservée à `/admin`, restreint par email (`ADMIN_EMAILS`)

## Traitement 5 — Support et réclamations

- **Finalité** : répondre aux demandes des utilisateurs (support, exercice des droits RGPD, réclamations)
- **Personnes concernées** : toute personne contactant contractclearcontact@gmail.com
- **Données traitées** : contenu de l'échange, adresse email
- **Base légale** : intérêt légitime / obligation légale (réponse aux demandes RGPD)
- **Destinataires** : aucun (boîte email personnelle du responsable)
- **Durée de conservation** : le temps nécessaire au traitement de la demande

---

## Exercice des droits et suppression

- Suppression en libre-service : bouton "Supprimer mon compte" sur `/account`
  (`DELETE /api/account/delete`) — supprime la ligne `auth.users`, qui
  entraîne la suppression en cascade du profil, de l'historique et des
  événements analytics associés (contraintes `ON DELETE CASCADE`).
- Toute autre demande (accès, rectification, portabilité) : par email à
  contractclearcontact@gmail.com, traitée manuellement.

## Historique des mises à jour

- 2026-09-20 : création du registre ; ajout de la suppression de compte en libre-service.
