const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true, trim: true }
}, {
    collection: 'Categorias',
    versionKey: false,
    strict: false
});

module.exports = mongoose.models.Categoria || mongoose.model('Categoria', categoriaSchema);
