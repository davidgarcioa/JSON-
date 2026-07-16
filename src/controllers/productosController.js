const Producto = require('../models/Producto');

const obtenerProductos = async (req, res) => {
    try { res.json(await Producto.find().populate('categoria')); }
    catch (error) { res.status(500).json({ error: 'Error al consultar los productos' }); }
};

const crearProducto = async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json({ mensaje: 'Producto creado', id_generado: producto._id, datosGuardados: producto });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validacion de Mongoose fallida',
                campos: Object.values(error.errors).map((detalle) => detalle.message)
            });
        }
        res.status(500).json({ error: 'Error critico al guardar el producto' });
    }
};

const actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ mensaje: 'Producto actualizado correctamente', datos: producto });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de producto invalido' });
        if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
        res.status(500).json({ error: 'No se pudo actualizar el producto' });
    }
};

const eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);
        if (!producto) return res.status(404).json({ error: 'Producto no encontrado o ya fue eliminado' });
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de producto invalido' });
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
};

module.exports = { obtenerProductos, crearProducto, actualizarProducto, eliminarProducto };
