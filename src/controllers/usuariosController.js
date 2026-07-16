const Usuario = require('../models/Usuario');

const obtenerUsuarios = async (req, res) => {
    try {
        res.json(await Usuario.find());
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los usuarios' });
    }
};

const crearUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.status(201).json({ mensaje: 'Usuario creado', id_generado: usuario._id, datosGuardados: usuario });
    } catch (error) {
        if (error.name === 'ValidationError') return res.status(400).json({ error: 'Formato invalido, nombre, email y password son obligatorios' });
        res.status(500).json({ error: 'Error critico al guardar el usuario' });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado correctamente', datos: usuario });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de usuario invalido' });
        if (error.name === 'ValidationError') return res.status(400).json({ error: error.message });
        res.status(500).json({ error: 'No se pudo actualizar el usuario' });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado o ya fue eliminado' });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        if (error.name === 'CastError') return res.status(400).json({ error: 'Id de usuario invalido' });
        res.status(500).json({ error: 'No se pudo eliminar el usuario' });
    }
};

module.exports = { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario };
