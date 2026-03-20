CREATE TABLE IF NOT EXISTS songs (
  id        SERIAL PRIMARY KEY,
  campo1    VARCHAR(255) NOT NULL,  
  campo2    VARCHAR(255) NOT NULL,  
  campo3    TEXT         NOT NULL,  
  campo4    INTEGER      NOT NULL,  
  campo5    FLOAT        NOT NULL,  
  campo6    BOOLEAN      NOT NULL   
);