const express = require('express');
const controller = require('../controllers/productosController');

const router = express.Router();

router.get('/', controller.obtenerProductos);
router.post('/', controller.crearProducto);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;
