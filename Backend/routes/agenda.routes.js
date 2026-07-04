const express = require('express');

const router = express.Router();

const agendaController = require('../controllers/agenda.controller');

router.get('/', agendaController.obtenerAgenda);

router.get('/:id', agendaController.obtenerCita);

router.post('/', agendaController.crearCita);

router.put('/:id', agendaController.actualizarCita);

router.delete('/:id', agendaController.eliminarCita);

module.exports = router;