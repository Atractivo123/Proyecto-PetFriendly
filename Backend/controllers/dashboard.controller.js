const Cliente = require('../models/cliente.model');

exports.obtenerDashboard = async (req, res) => {

    try {

        const totalClientes = await Cliente.countDocuments();

        res.json({

            totalClientes,
            totalMascotas: 0,
            totalAgenda: 0,
            totalInventario: 0,
            actividad: [],
            proximasCitas: []

        });

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};