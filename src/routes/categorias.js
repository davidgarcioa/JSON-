const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const coleccion = 'Categorias';

router.get('/', async (req, res) => {
    try {
        const categorias = await mongoose.connection.db.collection(coleccion).find({}).toArray();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar las categorias' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaCategoria = req.body;

        if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
            return res.status(400).json({
                error: 'Formato invalido, nombre y descripcion son obligatorios'
            });
        }

        const resultado = await mongoose.connection.db.collection(coleccion).insertOne(nuevaCategoria);

        res.status(201).json({
            mensaje: 'Categoria creada',
            id_generado: resultado.insertedId,
            datosGuardados: nuevaCategoria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error critico al guardar la categoria' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de categoria invalido' });
        }

        const resultado = await mongoose.connection.db.collection(coleccion).updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: req.body }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }

        res.json({
            mensaje: 'Categoria actualizada correctamente',
            modificaciones: resultado.modifiedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar la categoria' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de categoria invalido' });
        }

        const resultado = await mongoose.connection.db.collection(coleccion).deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id)
        });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ error: 'Categoria no encontrada o ya fue eliminada' });
        }

        res.json({ mensaje: 'Categoria eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar la categoria' });
    }
});

module.exports = router;
