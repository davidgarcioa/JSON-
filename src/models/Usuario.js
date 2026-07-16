const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true }
}, {
    collection: 'Usuarios',
    versionKey: false,
    strict: false
});

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
