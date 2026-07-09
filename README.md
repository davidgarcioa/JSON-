# API Node MongoDB Fase2

API creada con Node.js, Express y MongoDB Atlas para consultar e insertar datos de:

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

GET  /api/categorias
POST /api/categorias

GET  /api/productos
POST /api/productos

GET  /api/pedidos
POST /api/pedidos
```

Las pruebas de ejemplo estan en `test.http`.
