CREATE TABLE IF NOT EXISTS customers (
  id serial PRIMARY KEY,
  facebook_token text,
  facebook_refresh text,
  facebook_id text,
  first_name text,
  last_name text
);
