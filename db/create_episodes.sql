CREATE TABLE IF NOT EXISTS episodes (
  id serial primary key,
  customer_id int REFERENCES customers(id),
  feed_id int REFERENCES feeds(id),
  title text,
  description text,
  url text,
  guid text,
  categories text[],
  author text,
  date date,
  lat float,
  long float,
  enclosure_url text,
  enclosure_file text,
  enclosure_size text,
  enclosure_mime text,
  itunes_author text,
  itunes_explicit text,
  itunes_subtitle text,
  itunes_summary text,
  itunes_duration text,
  itunes_keywords text[],
  itunes_image text
);