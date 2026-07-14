const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const coleccion = 'Productos';

router.get('/', async (req, res) => {
    try {
        const productos = await mongoose.connection.db.collection(coleccion).find({}).toArray();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los productos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoProducto = req.body;
        if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.categoria) {
            return res.status(400).json({ error: 'Formato invalido, nombre, precio y categoria son obligatorios' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).insertOne(nuevoProducto);
        res.status(201).json({ mensaje: 'Producto creado', id_generado: resultado.insertedId, datosGuardados: nuevoProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error critico al guardar el producto' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de producto invalido' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (resultado.matchedCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto actualizado correctamente', modificaciones: resultado.modifiedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar el producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de producto invalido' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id)
        });
        if (resultado.deletedCount === 0) return res.status(404).json({ error: 'Producto no encontrado o ya fue eliminado' });
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});

module.exports = router;
