CREATE TABLE IF NOT EXISTS customers (
  id serial PRIMARY KEY,
  google_token text,
  google_refresh text,
  google_id text UNIQUE,
  google_photo text,
  first_name text,
  last_name text
);
