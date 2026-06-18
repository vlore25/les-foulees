# Plan de Test Complet - Les Foulées Avrillaises

Ce document détaille les étapes méthodiques pour tester l'intégralité de l'application avant sa mise en production. Il couvre les tests fonctionnels, de sécurité, de performance et l'expérience utilisateur.

## 1. Préparation de l'Environnement de Test
- [ ] **Variables d'environnement** : Vérifier que le `.env` et `.env.production` sont correctement configurés (URL base de données Neon DB, clé Resend, clés secrètes d'authentification JWT, Vercel Blob API).
- [ ] **Base de données** : 
  - Exécuter les migrations Prisma (`bunx prisma db push` ou `bunx prisma migrate deploy`).
  - Vérifier que la base de données Serverless (Neon DB) est accessible et ne timeout pas lors des requêtes Edge.
- [ ] **Compilation (Build)** : Lancer `bun run build` et vérifier qu'il n'y a aucune erreur de compilation TypeScript ou ESLint.
- [ ] **Lancement Local & Preview** : 
  - Démarrer l'application avec `bun run start` pour tester les conditions de production en local.
  - Tester les déploiements de Preview (sur Vercel) pour vérifier l'intégration avec Vercel Edge Functions et Blob Storage.

## 2. Tests de l'Espace Public (Visiteur)
- [ ] **Navigation & Accueil** : Vérifier que la page d'accueil se charge correctement, est responsive (mobile/desktop) et que les informations du club sont exactes.
- [ ] **Calendrier des événements** : S'assurer que seuls les événements marqués comme "Publics" sont visibles par les visiteurs.
- [ ] **Formulaire de contact** : 
  - Remplir le formulaire avec des données valides et vérifier la réception de l'email via l'API Resend.
  - Tester avec des données invalides (ex. email erroné) pour valider la gestion des erreurs et l'affichage des messages.
- [ ] **Accessibilité (A11y)** : Vérifier la navigation au clavier et le contraste (via l'outil Lighthouse).

## 3. Tests d'Authentification & Sécurité (Edge Runtime)
- [ ] **Inscription** :
  - Créer un nouveau compte utilisateur avec des données valides.
  - Vérifier le chiffrement du mot de passe dans la base de données (hachage bcrypt).
- [ ] **Connexion / Déconnexion** :
  - Se connecter avec des identifiants valides et s'assurer d'être redirigé correctement (gestion des JWT via `jose`).
  - Tester des identifiants invalides et vérifier les messages d'erreur.
  - Vérifier que le cookie de session est correctement détruit lors de la déconnexion.
- [ ] **Récupération de mot de passe** :
  - Tester le flux d'oubli de mot de passe et la réception de l'email contenant le jeton.
  - Tester l'expiration ou l'invalidité du jeton de réinitialisation.
- [ ] **Sécurité des routes (Edge Proxy)** : 
  - Essayer d'accéder aux routes `/admin` et espace adhérent sans être connecté (doit rediriger vers `/login` instantanément grâce au fichier `proxy.ts`).
  - Vérifier que `proxy.ts` ne produit aucune erreur Edge Runtime (isolation des dépendances Node.js via `session-edge.ts`).

## 4. Tests de l'Espace Adhérent
- [ ] **Profil Utilisateur** :
  - Mettre à jour les informations personnelles (adresse, téléphone, contact d'urgence).
  - Modifier les préférences de visibilité (masquer/afficher email ou téléphone dans l'annuaire).
- [ ] **Processus d'Adhésion** :
  - Remplir le formulaire complet d'adhésion pour la saison en cours.
  - Uploader un certificat médical (vérifier la sauvegarde dans Vercel Blob).
  - Générer et vérifier la conformité du bulletin d'adhésion PDF généré automatiquement.
- [ ] **Événements (Espace interne)** :
  - S'inscrire et se désinscrire d'un événement réservé aux membres (entraînements, sorties).
  - Vérifier que la liste des participants de l'événement se met à jour correctement.
- [ ] **Annuaire et Documents** :
  - Consulter l'annuaire des membres et vérifier que les règles de visibilité des coordonnées sont bien respectées.
  - Essayer de télécharger un document mis à disposition par le club.

## 5. Tests de l'Espace Administration (Rôle ADMIN)
- [ ] **Contrôle d'accès Admin** : Se connecter avec un compte utilisateur standard (USER) et vérifier l'impossibilité stricte d'accéder au dashboard administrateur et à ses API.
- [ ] **Gestion des Saisons** :
  - Créer une nouvelle saison avec ses tarifs et dates d'ouverture/fermeture.
  - Modifier l'ancienne saison et vérifier que les nouvelles adhésions prennent bien en compte la bonne saison.
- [ ] **Validation des Adhésions** :
  - Passer un dossier d'adhésion du statut "En attente" à "Validé" ou "Rejeté".
  - Vérifier l'envoi des notifications par email liées aux changements de statut du dossier.
- [ ] **Gestion des Événements** :
  - Créer un événement et définir sa visibilité (Public / Privé).
  - Modifier les détails d'un événement existant (date, lieu, description).
  - Supprimer un événement et vérifier l'impact ou l'avertissement concernant les inscrits.
- [ ] **Gestion des Utilisateurs** :
  - Changer le rôle d'un utilisateur (de USER à ADMIN) et vérifier ses nouveaux droits.
  - Désactiver un compte utilisateur et vérifier qu'il ne peut plus se connecter au site.
- [ ] **Documents** : Uploader, lister et supprimer des documents administratifs (PDF).

## 6. Tests Techniques & Performances
- [ ] **Upload de Fichiers (Vercel Blob)** : Vérifier que les fichiers uploadés (ex: certificats médicaux, documents) sont stockés correctement sur Vercel Blob et que les liens d'accès sécurisés fonctionnent.
- [ ] **Tests Automatisés** : Lancer la suite de tests avec `bun test` ou `npm run test` et s'assurer que tous les tests unitaires et d'intégration Jest passent.
- [ ] **Performances** : Analyser les temps de réponse avec les DevTools, s'assurer que l'optimisation des images `next/image` et Turbopack (en dev) accélèrent bien l'application.
- [ ] **Navigateurs & Mobile** : Vérifier l'interface sur Chrome, Firefox, Safari et sur les navigateurs mobiles (iOS / Android).

## 7. Préparation Finale au Déploiement
- [ ] **Purge des Données** : S'assurer qu'aucune donnée de test ne se retrouve sur la base de données de production Neon DB.
- [ ] **Déploiement Vercel** : 
  - Déployer la branche principale sur Vercel en production.
  - Vérifier que toutes les variables d'environnement (`JWT_SECRET`, etc.) sont bien renseignées dans l'interface de Vercel.
- [ ] **Sauvegarde de la BDD** : Vérifier la politique de snapshot automatique de Neon DB en cas de problème.
