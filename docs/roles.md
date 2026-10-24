# Définition des Rôles et Accès API

## 👤 Candidat

- **Créer un compte** → `POST /auth/signup`
- **Se connecter** → `POST /auth/login`
- **Voir/modifier son profil** → `GET /users/me` & `PUT /users/me`
- **Uploader un CV** → `POST /cvs`
- **Générer une lettre personnalisée** → `POST /ai/letter`
- **Voir les offres disponibles** → `GET /offers`
- **Postuler à une offre** → `POST /applications`
- **Voir ses candidatures** → `GET /applications/me`

## 🧑‍💼 Employeur

- **Créer un compte** → `POST /auth/signup`
- **Se connecter** → `POST /auth/login`
- **Publier une offre** → `POST /offers`
- **Modifier une offre** → `PUT /offers/{id}`
- **Supprimer une offre** → `DELETE /offers/{id}`
- **Voir les offres publiées** → `GET /offers/mine`
- **Voir les candidatures reçues** → `GET /offers/{id}/applications`
- **Consulter les CVs pertinents** → `GET /offers/{id}/candidates`
- **Contacter un candidat** → `POST /messages`

## 🔧 Admin

- **Voir tous les utilisateurs** → `GET /admin/users`
- **Voir toutes les offres** → `GET /admin/offers`
- **Supprimer un utilisateur** → `DELETE /users/{id}`
- **Supprimer une offre** → `DELETE /offers/{id}`
- **Voir les statistiques générales** → `GET /admin/stats`
- **Accès total aux logs et audits** → `GET /admin/logs`
