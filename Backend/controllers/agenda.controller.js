const Agenda = require('../models/agenda.model');
const Mascota = require('../models/mascota.model');

const validarMascotaCliente = async (clienteId, mascotaId) => {

    const mascota = await Mascota.findById(mascotaId);

    if (!mascota) {
        return {
            valido: false,
            status: 404,
            mensaje: 'Mascota no encontrada'
        };
    }

    if (mascota.cliente.toString() !== clienteId) {
        return {
            valido: false,
            status: 400,
            mensaje: 'La mascota no pertenece al cliente seleccionado'
        };
    }

    return {
        valido: true
    };

};

// Obtener todas las citas
exports.obtenerAgenda = async (req, res) => {
    try {
        const citas = await Agenda.find()
            .populate('cliente', 'nombre apellido documento telefono')
            .populate('mascota', 'nombre especie raza sexo')
            .sort({ fecha: 1, hora: 1 });

        res.status(200).json(citas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la agenda',
            error: error.message
        });
    }
};

// Obtener una cita por ID
exports.obtenerCita = async (req, res) => {
    try {
        const cita = await Agenda.findById(req.params.id)
            .populate('cliente', 'nombre apellido documento telefono')
            .populate('mascota', 'nombre especie raza sexo');

        if (!cita) {
            return res.status(404).json({
                mensaje: 'Cita no encontrada'
            });
        }

        res.json(cita);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};


// Crear cita
exports.crearCita = async (req, res) => {
    try {
                const validacion = await validarMascotaCliente(
            req.body.cliente,
            req.body.mascota
        );

        if (!validacion.valido) {
            return res.status(validacion.status).json({
                mensaje: validacion.mensaje
            });
        }
        const cita = new Agenda(req.body);

        await cita.save();

        const citaCreada = await cita.populate([
            {
                path: 'cliente',
                select: 'nombre apellido documento telefono'
            },
            {
                path: 'mascota',
                select: 'nombre especie raza sexo'
            }
        ]);

        res.status(201).json(citaCreada);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Actualizar cita
exports.actualizarCita = async (req, res) => {
    try {        
        const validacion = await validarMascotaCliente(
            req.body.cliente,
            req.body.mascota
        );

        if (!validacion.valido) {
            return res.status(validacion.status).json({
                mensaje: validacion.mensaje
            });
        }
        
        const cita = await Agenda.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('cliente', 'nombre apellido documento telefono')
            .populate('mascota', 'nombre especie raza sexo');

        if (!cita) {
            return res.status(404).json({
                mensaje: 'Cita no encontrada'
            });
        }

        res.json(cita);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Eliminar cita
exports.eliminarCita = async (req, res) => {
    try {
        const cita = await Agenda.findByIdAndDelete(req.params.id);

        if (!cita) {
            return res.status(404).json({
                mensaje: 'Cita no encontrada'
            });
        }

        res.json({
            mensaje: 'Cita eliminada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};