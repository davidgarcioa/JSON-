const express = require('express');
const controller = require('../controllers/pedidosController');

const router = express.Router();
const estadoRouter = express.Router();

router.get('/', controller.obtenerPedidos);
router.post('/', controller.crearPedido);
router.put('/:id', controller.actualizarPedido);
router.delete('/:id', controller.eliminarPedido);
estadoRouter.patch('/actualizar-estado/:id', controller.actualizarEstado);

module.exports = { router, estadoRouter };
