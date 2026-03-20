CREATE TABLE IF NOT EXISTS songs (
  id        SERIAL PRIMARY KEY,
  title    VARCHAR(255) NOT NULL,  
  genre_description     VARCHAR(255) NOT NULL,  
  lyrics    TEXT         NOT NULL,  
  producers INTEGER      NOT NULL, 
  duration  FLOAT        NOT NULL,  
  grammy    BOOLEAN      NOT NULL   
);