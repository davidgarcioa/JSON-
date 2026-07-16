const Categoria = require('../models/Categoria');

const obtenerCategorias = async (req, res) => {
    try { res.json(await Categoria.find()); }
    catch (error) { res.status(500).json({ error: 'Error al consultar las categorias' }); }
};

const crearCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.create(req.body);
        res.status(201).json({ mensaje: 'Categoria creada', id_generado: categoria._id, datosGuardados: categoria });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: 'Formato invalido, nombre y descripcion son obligatorios' });
        res.status(500).json({ error: 'Error critico al guardar la categoria' });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!categoria) return res.status(404).json({ error: 'Categoria no encontrada' });
        res.json({ mensaje: 'Categoria actualizada correctamente', datos: categoria });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de categoria invalido' });
        if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
        res.status(500).json({ error: 'No se pudo actualizar la categoria' });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findByIdAndDelete(req.params.id);
        if (!categoria) return res.status(404).json({ error: 'Categoria no encontrada o ya fue eliminada' });
        res.json({ mensaje: 'Categoria eliminada correctamente' });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de categoria invalido' });
        res.status(500).json({ error: 'No se pudo eliminar la categoria' });
    }
};

module.exports = { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria };
