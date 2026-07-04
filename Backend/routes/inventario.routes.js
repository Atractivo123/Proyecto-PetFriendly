const express = require('express');

const router = express.Router();

const inventarioController = require('../controllers/inventario.controller');

router.get('/', inventarioController.obtenerInventario);

router.get('/:id', inventarioController.obtenerProducto);

router.post('/', inventarioController.crearProducto);

router.put('/:id', inventarioController.actualizarProducto);

router.delete('/:id', inventarioController.eliminarProducto);

module.exports = router;