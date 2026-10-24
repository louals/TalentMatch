# MongoDB Schema

- Collection: cvs
  - _id
  - user_id (UUID)
  - raw_text (string)
  - extracted_skills (array of strings)
  - created_at (ISODate)

- Collection: matchings
  - _id
  - cv_id (ObjectId)
  - offer_id (UUID)
  - score (float)
  - justification (string)

- Stockage des PDF CVs → via GridFS
