const express = require('express');

const router = express.Router();

const mascotaController = require('../controllers/mascota.controller');

router.get('/', mascotaController.obtenerMascotas);

router.get('/:id', mascotaController.obtenerMascota);

router.post('/', mascotaController.crearMascota);

router.put('/:id', mascotaController.actualizarMascota);

router.delete('/:id', mascotaController.eliminarMascota);

module.exports = router;
