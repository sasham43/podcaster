CREATE TABLE IF NOT EXISTS customers (
  id serial PRIMARY KEY,
  facebook_token text,
  first_name text,
  last_name text
);
