# Documentation - Les Foulées Avrillaises

Ce document présente les fonctionnalités actuelles du projet "Les Foulées Avrillaises" ainsi que les pistes d'amélioration identifiées.

## 1. Présentation du projet
Le projet "Les Foulées Avrillaises" est une application web destinée à la gestion d'une association de course à pied de la ville de Avrillé. Elle permet de gérer les adhérents, les événements, les adhésions annuelles et les documents administratifs du club.

## 2. Pile Technique (Stack)
- **Framework :** Next.js 15 (App Router, Server Actions)
- **Langage :** TypeScript
- **Base de données :** PostgreSQL avec Prisma ORM
- **Authentification :** Gestion personnalisée avec `iron-session` et `jose`
- **Stylisation :** Tailwind CSS, Radix UI, Lucide React
- **Emails :** Resend et React Email
- **Documents :** PDF-lib, React-PDF pour la génération et l'affichage de documents
- **Déploiement :** Docker & Docker Compose

## 3. Fonctionnalités Principales

### A. Authentification et Gestion de Compte
- **Inscription & Connexion :** Création de compte utilisateur avec validation des données.
- **Récupération de mot de passe :** Flux complet via email avec jetons temporaires.
- **Profil Utilisateur :** Mise à jour des informations personnelles (adresse, téléphone, contact d'urgence, etc.).
- **Paramètres de visibilité :** Option pour afficher ou masquer son email/téléphone dans l'annuaire des membres.

### B. Espace Adhérent
- **Adhésion en ligne :** Formulaire complet pour s'inscrire à une saison (type d'adhésion, licence FFA, certificat médical).
- **Génération de documents :** Création automatique du bulletin d'adhésion au format PDF.
- **Événements :** Consultation et inscription aux entraînements, sorties ou compétitions du club.
- **Annuaire des membres :** Liste des membres du club avec leurs coordonnées (si autorisé).
- **Documents :** Accès aux documents internes et administratifs mis à disposition par le club.

### C. Administration
- **Gestion des Utilisateurs :** Liste complète, modification des rôles (ADMIN/USER), activation/désactivation de comptes.
- **Gestion des Événements :** Création, modification et suppression d'événements (Trail, Route, Entraînement, etc.) avec gestion de la visibilité (Public/Privé).
- **Gestion des Saisons :** Paramétrage des dates de début/fin et des tarifs (Standard, Couple, Jeune, FFA).
- **Gestion des Adhésions :** Suivi des dossiers (En attente, Validé, Rejeté), consultation des certificats médicaux et gestion des paiements.
- **Gestion Documentaire :** Mise en ligne de documents PDF pour les membres.

### D. Espace Public
- **Page d'accueil :** Présentation du club.
- **Compétitions :** Liste des événements publics.
- **Contact :** Formulaire de contact pour les non-membres.

## 4. Points d'Amélioration Identifiés

### Technique & Maintenance
- **Tests Automatisés :** Augmenter la couverture des tests unitaires et d'intégration (actuellement gérés par Jest).
- **Validation des données :** Harmoniser l'utilisation de Zod pour la validation côté serveur et client (Server Actions).
- **Stockage des fichiers :** Actuellement, les fichiers sont stockés localement (`public/uploads`). Pour la production, une migration vers un service de stockage objet (S3, Cloudinary) est recommandée.
- **Logs et Monitoring :** Mettre en place un système de journalisation (Sentry ou Winston) pour le suivi des erreurs en production.

### Fonctionnalités
- **Dashboard Admin enrichi :** Ajout de statistiques visuelles (graphiques de croissance, répartition des types d'adhésion).
- **Paiement en ligne :** Intégration d'une passerelle de paiement (Stripe) pour automatiser le règlement des cotisations.
- **Génération automatique de cartes de membre :** Création et envoi automatique d'une carte de membre PDF après validation de l'adhésion.
- **Notifications :** Système de notifications in-app ou via email pour les rappels d'événements ou le suivi de dossier.
- **Accessibilité (A11y) :** Vérifier et améliorer la conformité aux normes d'accessibilité sur l'ensemble des composants.

### Architecture
- **Optimisation des Images :** Exploiter davantage `next/image` pour l'optimisation automatique (actuellement configuré avec un pattern distant).
- **Mise en cache :** Optimiser le cache Next.js pour les requêtes de données fréquentes (annuaire, liste des événements).
