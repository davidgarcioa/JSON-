const Pedido = require('../models/Pedido');

const estadosValidos = ['pendiente', 'pagado', 'procesado', 'finalizado'];

const obtenerPedidos = async (req, res) => {
    try { res.json(await Pedido.find()); }
    catch (error) { res.status(500).json({ error: 'Error al consultar los pedidos' }); }
};

const crearPedido = async (req, res) => {
    try {
        const pedido = await Pedido.create(req.body);
        res.status(201).json({ mensaje: 'Pedido creado', id_generado: pedido._id, datosGuardados: pedido });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: 'Formato invalido, usuarioEmail, productos y total son obligatorios' });
        res.status(500).json({ error: 'Error critico al guardar el pedido' });
    }
};

const actualizarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        if (pedido.estado === 'finalizado') return res.status(403).json({ error: 'No se puede modificar el pedido porque su estado ya es finalizado' });

        Object.assign(pedido, req.body);
        await pedido.save();
        res.json({ mensaje: 'Pedido actualizado correctamente', datos: pedido });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de pedido invalido' });
        if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
        res.status(500).json({ error: 'No se pudo actualizar el pedido' });
    }
};

const eliminarPedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByIdAndDelete(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado o ya fue eliminado' });
        res.json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de pedido invalido' });
        res.status(500).json({ error: 'No se pudo eliminar el pedido' });
    }
};

const actualizarEstado = async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
        if (pedido.estado === 'finalizado') return res.status(403).json({ error: 'No se puede modificar el pedido porque su estado ya es finalizado' });

        const nuevoEstado = typeof req.body.estado === 'string' ? req.body.estado.trim().toLowerCase() : '';
        if (!estadosValidos.includes(nuevoEstado)) {
            return res.status(400).json({ error: `Estado invalido. Estados permitidos: ${estadosValidos.join(', ')}` });
        }

        const estadoAnterior = pedido.estado;
        pedido.estado = nuevoEstado;
        await pedido.save();
        res.json({ mensaje: 'Estado del pedido actualizado correctamente', estadoAnterior, nuevoEstado });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de pedido invalido' });
        res.status(500).json({ error: 'No se pudo actualizar el estado del pedido' });
    }
};

module.exports = { obtenerPedidos, crearPedido, actualizarPedido, eliminarPedido, actualizarEstado };
