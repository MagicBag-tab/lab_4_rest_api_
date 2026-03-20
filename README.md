# Songs API — REST CRUD

API REST con operaciones CRUD completas sobre un catálogo de canciones, construida con **Node.js + Express**, persistencia en **PostgreSQL** y entorno completamente containerizado con **Docker**.

---

## Levantar el sistema

> **Un solo comando levanta todo: API, base de datos y frontend.**

```bash
docker-compose up --build
```

| Servicio   | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:8088        |
| API        | http://localhost:8080/songs  |
| PostgreSQL | localhost:5432               |

Para detener:
```bash
docker-compose down
```

Para detener y borrar los datos persistidos:
```bash
docker-compose down -v
```

---

## Configuración

Copia el archivo de ejemplo y completa las variables:

```bash
cp .env.example .env
```

```env
DB_HOST=data
DB_PORT=5432
DB_NAME=musicdb
DB_USER=postgres
DB_PASSWORD=postgres
APP_PORT=8080
```

---

## Stack

| Capa           | Tecnología          |
|----------------|---------------------|
| Lenguaje       | JavaScript (ES Modules) |
| Runtime        | Node.js 20          |
| Framework      | Express 4           |
| Base de datos  | PostgreSQL 15       |
| Contenedores   | Docker + Docker Compose |
| Frontend       | Nginx + HTML/JS     |

---

## Estructura del proyecto

```
├── src/
│   ├── config/
│   │   └── db.js          # Conexión a PostgreSQL
│   ├── routes/
│   │   └── songs.js       # Definición de rutas y validaciones
│   └── server.js          # Punto de entrada
├── data/
│   └── init.sql           # Schema SQL
├── frontend/
│   ├── public/            # HTML, JS y assets
│   ├── nginx.conf         # Configuración de Nginx
│   └── Dockerfile
├── .env           # Plantilla de variables de entorno
├── .gitignore
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Recurso: Songs

### Estructura

| Campo       | Tipo    | Descripción                        | Restricciones  |
|-------------|---------|------------------------------------|----------------|
| id          | integer | Identificador único                | PK, autoincrement |
| campo1      | string  | Título de la canción               | Requerido      |
| campo2      | string  | Género musical                     | Requerido      |
| campo3      | string  | Descripción de la letra            | Requerido      |
| campo4      | integer | Cantidad de productores            | Requerido      |
| campo5      | float   | Duración en minutos                | Requerido      |
| campo6      | boolean | ¿Ganó un Grammy?                   | Requerido      |

### Ejemplo de objeto

```json
{
  "id": 1,
  "campo1": "Bohemian Rhapsody",
  "campo2": "Rock",
  "campo3": "Un joven mata a un hombre y enfrenta las consecuencias de sus actos",
  "campo4": 3,
  "campo5": 5.55,
  "campo6": true
}
```

---

## Endpoints

### `GET /songs`
Retorna todos los registros.

```bash
curl http://localhost:8080/songs
```

**Respuesta `200 OK`:**
```json
[
  {
    "id": 1,
    "campo1": "Bohemian Rhapsody",
    "campo2": "Rock",
    "campo3": "Un joven mata a un hombre y enfrenta las consecuencias",
    "campo4": 3,
    "campo5": 5.55,
    "campo6": true
  }
]
```

---

### `GET /songs/:id`
Retorna un registro por ID.

```bash
curl http://localhost:8080/songs/1
```

**Respuesta `200 OK`:** objeto song  
**Respuesta `404 Not Found`:** `{ "error": "Song not found" }`

---

### `POST /songs`
Crea un nuevo registro. Todos los campos son requeridos.

```bash
curl -X POST http://localhost:8080/songs \
  -H "Content-Type: application/json" \
  -d '{
    "campo1": "Blinding Lights",
    "campo2": "Synth-pop",
    "campo3": "Un hombre conduce de noche pensando en su amor perdido",
    "campo4": 2,
    "campo5": 3.20,
    "campo6": true
  }'
```

**Respuesta `201 Created`:** objeto song creado  
**Respuesta `400 Bad Request`:** detalle del campo inválido

---

### `PUT /songs/:id`
Actualización completa. Todos los campos son requeridos.

```bash
curl -X PUT http://localhost:8080/songs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "campo1": "Bohemian Rhapsody",
    "campo2": "Rock Clásico",
    "campo3": "Un joven mata a un hombre y enfrenta las consecuencias",
    "campo4": 3,
    "campo5": 5.55,
    "campo6": true
  }'
```

**Respuesta `200 OK`:** objeto song actualizado  
**Respuesta `404 Not Found`:** `{ "error": "Song not found" }`

---

### `PATCH /songs/:id`
Actualización parcial. Solo se modifican los campos enviados.

```bash
curl -X PATCH http://localhost:8080/songs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "campo2": "Rock Progresivo",
    "campo6": false
  }'
```

**Respuesta `200 OK`:** objeto song actualizado  
**Respuesta `400 Bad Request`:** `{ "error": "No valid fields provided" }`

---

### `DELETE /songs/:id`
Elimina un registro por ID.

```bash
curl -X DELETE http://localhost:8080/songs/1
```

**Respuesta `200 OK`:** `{ "message": "Song deleted" }`  
**Respuesta `404 Not Found`:** `{ "error": "Song not found" }`

---

## Códigos de respuesta

| Código | Descripción                        |
|--------|------------------------------------|
| 200    | Operación exitosa                  |
| 201    | Recurso creado exitosamente        |
| 400    | Datos inválidos o campos faltantes |
| 404    | Recurso no encontrado              |
| 500    | Error interno del servidor         |

---

## Base de datos

El schema se ejecuta automáticamente al primer arranque de Docker mediante `data/init.sql`:

```sql
CREATE TABLE IF NOT EXISTS songs (
  id          SERIAL PRIMARY KEY,
  titulo      VARCHAR(255) NOT NULL,
  genero      VARCHAR(255) NOT NULL,
  descripcion TEXT         NOT NULL,
  productores INTEGER      NOT NULL,
  duracion    FLOAT        NOT NULL,
  grammy      BOOLEAN      NOT NULL
);
```

Para conectarse manualmente a la base de datos:

```bash
docker exec -it postgres-db psql -U postgres -d musicdb
```

---

## Infraestructura Docker

El `docker-compose.yml` levanta tres servicios:

```
┌─────────────────────────────────────────────┐
│              docker-compose                 │
│                                             │
│  ┌──────────┐    ┌──────────┐    ┌────────┐ │
│  │ frontend │───▶│   app    │───▶│   db  │ │
│  │  :8088   │    │  :8080   │    │  :5432 │ │
│  │  nginx   │    │ node.js  │    │  psql  │ │
│  └──────────┘    └──────────┘    └────────┘ │
└─────────────────────────────────────────────┘
```

- **`db`** arranca primero con healthcheck — la app espera a que PostgreSQL esté listo antes de iniciar
- **`app`** se conecta a la DB usando variables de entorno, sin credenciales hardcodeadas
- **`frontend`** sirve los archivos estáticos mediante Nginx y consume la API en el puerto 8080
- Los datos de PostgreSQL se persisten en un volumen Docker entre reinicios

---

## Validaciones

Todos los campos son requeridos en `POST` y `PUT`. Los tipos se validan estrictamente:

- `campo1`, `campo2`, `campo3` — string no vacío
- `campo4` — entero (`Number.isInteger`)
- `campo5` — número decimal (`typeof === 'number'`)
- `campo6` — booleano (`typeof === 'boolean'`)

En `PATCH`, solo se validan los campos presentes en el body.

---

## Nivel de entrega

**Nivel 3 — Senior** con bonus de integración full stack y personalización del frontend.