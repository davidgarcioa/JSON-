const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const usuariosRoutes = require('./src/routes/usuarios');
const categoriasRoutes = require('./src/routes/categorias');
const productosRoutes = require('./src/routes/productos');
const { router: pedidosRoutes, actualizarEstado } = require('./src/routes/pedidos');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'Fase2';

mongoose.connect(process.env.MONGO_URI, { dbName: DB_NAME })
    .then(() => console.log('Conexion exitosa'))
    .catch((error) => console.error('No se pudo conectar', error));

app.get('/', (req, res) => {
    res.json({
        mensaje: 'El server esta funcionando',
        rutas: ['/api/usuarios', '/api/categorias', '/api/productos', '/api/pedidos']
    });
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.patch('/api/v1/actualizar-estado/:id', actualizarEstado);

app.listen(PORT, () => {
    console.log(`El backend esta escuchando en localhost:${PORT}`);
});
