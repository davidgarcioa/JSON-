const express = require('express');
const controller = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', controller.obtenerUsuarios);
router.post('/', controller.crearUsuario);
router.put('/:id', controller.actualizarUsuario);
router.delete('/:id', controller.eliminarUsuario);

module.exports = router;
