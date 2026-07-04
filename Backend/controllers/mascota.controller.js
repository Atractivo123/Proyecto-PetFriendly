const Mascota = require('../models/mascota.model');

// Obtener todas las mascotas
exports.obtenerMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.find()
            .populate('cliente', 'nombre apellido documento telefono')
            .sort({ createdAt: -1 });

        res.status(200).json(mascotas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las mascotas',
            error: error.message
        });
    }
};

// Obtener una mascota por ID
exports.obtenerMascota = async (req, res) => {
    try {
        const mascota = await Mascota.findById(req.params.id)
            .populate('cliente', 'nombre apellido documento telefono');

        if (!mascota) {
            return res.status(404).json({
                mensaje: 'Mascota no encontrada'
            });
        }

        res.json(mascota);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Crear mascota
exports.crearMascota = async (req, res) => {
    try {
        const mascota = new Mascota(req.body);

        await mascota.save();

        const mascotaCreada = await mascota.populate('cliente', 'nombre apellido documento telefono');

        res.status(201).json(mascotaCreada);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Actualizar mascota
exports.actualizarMascota = async (req, res) => {
    try {
        const mascota = await Mascota.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('cliente', 'nombre apellido documento telefono');

        if (!mascota) {
            return res.status(404).json({
                mensaje: 'Mascota no encontrada'
            });
        }

        res.json(mascota);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Eliminar mascota
exports.eliminarMascota = async (req, res) => {
    try {
        const mascota = await Mascota.findByIdAndDelete(req.params.id);

        if (!mascota) {
            return res.status(404).json({
                mensaje: 'Mascota no encontrada'
            });
        }

        res.json({
            mensaje: 'Mascota eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};
