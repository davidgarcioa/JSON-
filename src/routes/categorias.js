const express = require('express');
const controller = require('../controllers/categoriasController');

const router = express.Router();

router.get('/', controller.obtenerCategorias);
router.post('/', controller.crearCategoria);
router.put('/:id', controller.actualizarCategoria);
router.delete('/:id', controller.eliminarCategoria);

module.exports = router;
