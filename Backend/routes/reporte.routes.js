const express = require('express');

const router = express.Router();

const reporteController = require('../controllers/reporte.controller');

router.get('/dashboard', reporteController.obtenerReporteDashboard);

router.get('/ventas', reporteController.obtenerReporteVentas);

router.get('/inventario', reporteController.obtenerReporteInventario);

router.get('/agenda', reporteController.obtenerReporteAgenda);

router.get('/clientes', reporteController.obtenerReporteClientes);

module.exports = router;