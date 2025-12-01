# CodeFlix: Catálogo de películas de fantasía

CodeFlix es un sistema web para explorar un catálogo de películas del género fantasía. Incluye página principal responsive, catálogo por tarjetas, detalle de película, búsqueda/filtrado y lógica de inicio de sesión. En el equipo turquesa trabajamos con metodología ágil Kanban.

Equipo:
- Maryam Michelle Del Monte Ortega
- Carlos Adrián Celaya Nava
- Eduardo Martínez Mejía
- Sahara Mariel Monroy Romero

## Requisitos
- Node.js 20+ y npm
- Docker y Docker Compose
- MySQL 8 (via Docker)
- Git

## Tecnologías
- Next.js 16, React 19
- Tailwind CSS 4
- Prisma ORM (+ @prisma/client)
- MySQL 8
- bcryptjs, jsonwebtoken
- ESLint

## Instalación

1) Clona el repositorio y entra al proyecto:
- git clone https://github.com/MarielCat/Proyecto-Ingeniera-de-Software.git
- cd Proyecto-Ingeniera-de-Software
- cd codeflix

2) Instala dependencias:
- npm install

3) Configura variables de entorno en un archivo `.env` dentro de `codeflix`:
- DATABASE_URL="mysql://codeflix:codeflixpass@localhost:3307/codeflix"
- JWT_SECRET="cambia-este-valor-por-uno-seguro"
- NEXT_PUBLIC_APP_NAME="CodeFlix"
- NODE_ENV="development"

4) Levanta la base de datos con Docker Compose:
- docker compose up -d
- Verifica:
  - docker ps
  - docker logs codeflix-mysql

5) Inicializa Prisma:
- npx prisma generate
- npx prisma db push

## Ejecución

Desarrollo:
- npm run dev

Producción:
- npm run build
- npm run start

## Base de Datos (Docker Compose)

Archivo: `codeflix/docker-compose.yml`

- Imagen: mysql:8.0
- Puertos: 3307 (host) -> 3306 (container)
- Credenciales:
  - root: rootpass
  - usuario: codeflix / password: codeflixpass
  - base: codeflix
- Volumen persistente: `mysql_data`
- Healthcheck: `mysqladmin ping`
- Autenticación: `mysql_native_password`

Comandos útiles:
- Subir: docker compose up -d
- Estado: docker ps
- Logs: docker logs codeflix-mysql
- Apagar: docker compose down
- Apagar y borrar datos: docker compose down -v

Conexión desde la app:
- Host: localhost
- Puerto: 3307
- Usuario: codeflix
- Password: codeflixpass
- Database: codeflix

## Scripts
- npm run dev: servidor de desarrollo
- npm run build: construcción de la app
- npm run start: ejecución en producción
- npm run lint: análisis de código con ESLint

## Estructura (resumen)
- codeflix/
  - docker-compose.yml
  - prisma/ (schema y migraciones)
  - app/ (api, páginas, lógica)
  - public/
  - components/
  - package.json
  - .env (local)

## Calidad y flujo de trabajo
- Kanban para gestión de tareas
- Commits claros y frecuentes
- Ramas por feature: `feature/<nombre de nuestras feats>`

## Notas
- Cambiar `JWT_SECRET` por un valor seguro en producción.
- Si cambias puertos o credenciales en `docker-compose.yml`, actualiza `DATABASE_URL` en `.env`.
- Para ver el cliente Prisma: `npx prisma studio`.