const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'Fase2';

mongoose.connect(process.env.MONGO_URI, { dbName: DB_NAME })
    .then(() => console.log("Conexion exitosa"))
    .catch(err => console.error("No se pudo conectar", err));

const colecciones = {
    usuarios: 'Usuarios',
    categorias: 'Categorias',
    productos: 'Productos',
    pedidos: 'Pedidos'
};

app.get('/', (req, res) => {
    res.json({
        mensaje: "El server esta funcionando",
        rutas: [
            "/api/usuarios",
            "/api/categorias",
            "/api/productos",
            "/api/pedidos"
        ]
    });
});

app.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await mongoose.connection.db.collection(colecciones.usuarios).find({}).toArray();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los usuarios" });
    }
});

app.post('/api/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = req.body;

        if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
            return res.status(400).json({
                error: "Formato invalido, nombre, email y password son obligatorios"
            });
        }

        const resultado = await mongoose.connection.db.collection(colecciones.usuarios).insertOne(nuevoUsuario);

        res.status(201).json({
            mensaje: "Usuario creado",
            id_generado: resultado.insertedId,
            datosGuardados: nuevoUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error critico al guardar el usuario" });
    }
});

app.get('/api/categorias', async (req, res) => {
    try {
        const categorias = await mongoose.connection.db.collection(colecciones.categorias).find({}).toArray();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar las categorias" });
    }
});

app.post('/api/categorias', async (req, res) => {
    try {
        const nuevaCategoria = req.body;

        if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
            return res.status(400).json({
                error: "Formato invalido, nombre y descripcion son obligatorios"
            });
        }

        const resultado = await mongoose.connection.db.collection(colecciones.categorias).insertOne(nuevaCategoria);

        res.status(201).json({
            mensaje: "Categoria creada",
            id_generado: resultado.insertedId,
            datosGuardados: nuevaCategoria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error critico al guardar la categoria" });
    }
});

app.get('/api/productos', async (req, res) => {
    try {
        const productos = await mongoose.connection.db.collection(colecciones.productos).find({}).toArray();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los productos" });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = req.body;

        if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.categoria) {
            return res.status(400).json({
                error: "Formato invalido, nombre, precio y categoria son obligatorios"
            });
        }

        const resultado = await mongoose.connection.db.collection(colecciones.productos).insertOne(nuevoProducto);

        res.status(201).json({
            mensaje: "Producto creado",
            id_generado: resultado.insertedId,
            datosGuardados: nuevoProducto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error critico al guardar el producto" });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await mongoose.connection.db.collection(colecciones.pedidos).find({}).toArray();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los pedidos" });
    }
});

app.post('/api/pedidos', async (req, res) => {
    try {
        const nuevoPedido = req.body;

        if (!nuevoPedido.usuarioEmail || !nuevoPedido.productos || !nuevoPedido.total) {
            return res.status(400).json({
                error: "Formato invalido, usuarioEmail, productos y total son obligatorios"
            });
        }

        const resultado = await mongoose.connection.db.collection(colecciones.pedidos).insertOne(nuevoPedido);

        res.status(201).json({
            mensaje: "Pedido creado",
            id_generado: resultado.insertedId,
            datosGuardados: nuevoPedido
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error critico al guardar el pedido" });
    }
});

app.listen(PORT, () => {
    console.log(`El backend esta escuchando en localhost:${PORT}`);
});
