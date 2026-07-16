const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    usuarioEmail: { type: String, required: true, trim: true },
    productos: { type: Array, required: true },
    total: { type: Number, required: true },
    estado: {
        type: String,
        enum: ['pendiente', 'pagado', 'procesado', 'finalizado'],
        default: 'pendiente'
    }
}, {
    collection: 'Pedidos',
    versionKey: false,
    strict: false
});

module.exports = mongoose.models.Pedido || mongoose.model('Pedido', pedidoSchema);
