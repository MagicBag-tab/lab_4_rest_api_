CREATE TABLE IF NOT EXISTS songs (
  id        SERIAL PRIMARY KEY,
  campo1    VARCHAR(255) NOT NULL,  
  campo2    VARCHAR(255) NOT NULL,  
  campo3    TEXT         NOT NULL,  
  campo4    INTEGER      NOT NULL,  
  campo5    FLOAT        NOT NULL,  
  campo6    BOOLEAN      NOT NULL   
);

INSERT INTO songs (campo1, campo2, campo3, campo4, campo5, campo6) VALUES
('Bohemian Rhapsody', 'Rock', 'Una canción sobre un joven que mata a un hombre y enfrenta las consecuencias', 3, 5.55, true),
('Blinding Lights', 'Synth-pop', 'Un hombre conduce de noche pensando en su amor', 2, 3.20, true),
('Shape of You', 'Pop', 'Una historia de amor que comienza en un bar', 4, 3.53, false);