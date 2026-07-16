# API Node MongoDB Fase2

API creada con Node.js, Express y MongoDB Atlas para consultar, insertar, actualizar y eliminar datos de:

- Usuarios
- Categorias
- Productos
- Pedidos

## Instalacion

```bash
npm install
```

## Variables de entorno

Copia `.env.example` como `.env` y completa la conexion de MongoDB Atlas.

```env
PORT=3000
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/
DB_NAME=Fase2
```

## Ejecutar

```bash
npm start
```

## Rutas

```txt
GET  /api/usuarios
POST /api/usuarios
PUT  /api/usuarios/:id
DELETE /api/usuarios/:id

GET  /api/categorias
POST /api/categorias
PUT  /api/categorias/:id
DELETE /api/categorias/:id

GET  /api/productos
POST /api/productos
PUT  /api/productos/:id
DELETE /api/productos/:id

GET  /api/pedidos
POST /api/pedidos
PUT  /api/pedidos/:id
DELETE /api/pedidos/:id
PATCH /api/v1/actualizar-estado/:id
```

El endpoint `PATCH` actualiza unicamente el estado de un pedido. Los estados
permitidos son `pendiente`, `pagado`, `procesado` y `finalizado`. Un pedido que
ya se encuentre `finalizado` no se puede modificar.

Las pruebas de ejemplo estan en `tests/test.http`.

## Estructura del proyecto

```txt
src/
  models/       Esquemas y modelos de Mongoose
  controllers/ Logica de cada recurso
  routes/      Definicion de endpoints
data/      Archivos JSON de los ejercicios
scripts/   Scripts para preparar MongoDB
tests/     Peticiones HTTP para probar la API
```
