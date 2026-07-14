const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const coleccion = 'Usuarios';

router.get('/', async (req, res) => {
    try {
        const usuarios = await mongoose.connection.db.collection(coleccion).find({}).toArray();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los usuarios' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = req.body;
        if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.password) {
            return res.status(400).json({ error: 'Formato invalido, nombre, email y password son obligatorios' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).insertOne(nuevoUsuario);
        res.status(201).json({ mensaje: 'Usuario creado', id_generado: resultado.insertedId, datosGuardados: nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error critico al guardar el usuario' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de usuario invalido' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (resultado.matchedCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado correctamente', modificaciones: resultado.modifiedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de usuario invalido' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id)
        });
        if (resultado.deletedCount === 0) return res.status(404).json({ error: 'Usuario no encontrado o ya fue eliminado' });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
});

module.exports = router;
