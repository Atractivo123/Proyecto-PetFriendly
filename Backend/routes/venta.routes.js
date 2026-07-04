const express = require('express');

const router = express.Router();

const ventaController = require('../controllers/venta.controller');

router.get('/', ventaController.obtenerVentas);

router.get('/:id', ventaController.obtenerVenta);

router.post('/', ventaController.crearVenta);

router.put('/:id/anular', ventaController.anularVenta);

module.exports = router;