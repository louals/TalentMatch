# Entity Relational DB using PostgreSQL

- Table: users
  - id (UUID, PK)
  - email (string, unique)
  - password (hashed)
  - first_name (string)
  - last_name (string)
  - role (enum: candidate | employer | admin)
  - created_at (timestamp)

- Table: job_offers
  - id (UUID, PK)
  - title (string)
  - description (text)
  - criteria (JSON or text)
  - created_by (FK → users.id)
  - created_at (timestamp)

- Table: applications
  - id (UUID, PK)
  - user_id (FK → users.id)
  - offer_id (FK → job_offers.id)
  - cover_letter (text)
  - matching_score (float)
  - created_at (timestamp)
