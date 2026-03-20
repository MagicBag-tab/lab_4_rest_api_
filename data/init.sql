CREATE TABLE IF NOT EXISTS songs (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(255) NOT NULL,
  genero      VARCHAR(255) NOT NULL,
  descripcion TEXT         NOT NULL,
  productores INTEGER      NOT NULL,
  duracion    FLOAT        NOT NULL,
  grammy      BOOLEAN      NOT NULL
);