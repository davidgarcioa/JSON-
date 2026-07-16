const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0 }
}, {
    collection: 'Productos',
    versionKey: false,
    strict: false
});

module.exports = mongoose.models.Producto || mongoose.model('Producto', productoSchema);
