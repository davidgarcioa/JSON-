const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const coleccion = 'Pedidos';
const estadosValidos = ['pendiente', 'pagado', 'procesado', 'finalizado'];

const actualizarEstado = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de pedido invalido' });
        }

        const idPedido = new mongoose.Types.ObjectId(req.params.id);
        const pedido = await mongoose.connection.db.collection(coleccion).findOne({ _id: idPedido });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        if (pedido.estado === 'finalizado') {
            return res.status(403).json({
                error: 'No se puede modificar el pedido porque su estado ya es finalizado'
            });
        }

        const nuevoEstado = typeof req.body.estado === 'string'
            ? req.body.estado.trim().toLowerCase()
            : '';

        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({
                error: `Estado invalido. Estados permitidos: ${estadosValidos.join(', ')}`
            });
        }

        const resultado = await mongoose.connection.db.collection(coleccion).updateOne(
            { _id: idPedido, estado: { $ne: 'finalizado' } },
            { $set: { estado: nuevoEstado } }
        );

        if (resultado.matchedCount === 0) {
            return res.status(403).json({
                error: 'No se puede modificar el pedido porque su estado ya es finalizado'
            });
        }

        res.json({
            mensaje: 'Estado del pedido actualizado correctamente',
            estadoAnterior: pedido.estado,
            nuevoEstado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar el estado del pedido' });
    }
};

router.get('/', async (req, res) => {
    try {
        const pedidos = await mongoose.connection.db.collection(coleccion).find({}).toArray();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los pedidos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoPedido = req.body;
        if (!nuevoPedido.usuarioEmail || !nuevoPedido.productos || !nuevoPedido.total) {
            return res.status(400).json({ error: 'Formato invalido, usuarioEmail, productos y total son obligatorios' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).insertOne(nuevoPedido);
        res.status(201).json({ mensaje: 'Pedido creado', id_generado: resultado.insertedId, datosGuardados: nuevoPedido });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error critico al guardar el pedido' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de pedido invalido' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (resultado.matchedCount === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
        res.json({ mensaje: 'Pedido actualizado correctamente', modificaciones: resultado.modifiedCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar el pedido' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Id de pedido invalido' });
        }
        const resultado = await mongoose.connection.db.collection(coleccion).deleteOne({
            _id: new mongoose.Types.ObjectId(req.params.id)
        });
        if (resultado.deletedCount === 0) return res.status(404).json({ error: 'Pedido no encontrado o ya fue eliminado' });
        res.json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar el pedido' });
    }
});

module.exports = { router, actualizarEstado };
