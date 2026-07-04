const Cliente = require('../models/cliente.model');
const Mascota = require('../models/mascota.model');
const Agenda = require('../models/agenda.model');
const Inventario = require('../models/inventario.model');
const Venta = require('../models/venta.model');

exports.obtenerDashboard = async (req, res) => {

    try {

        const [
            totalClientes,
            totalMascotas,
            totalAgenda,
            totalInventario,
            totalVentas,
            ingresos,
            proximasCitas,
            ultimasVentas
        ] = await Promise.all([
            Cliente.countDocuments(),
            Mascota.countDocuments(),
            Agenda.countDocuments(),
            Inventario.countDocuments(),
            Venta.countDocuments({ estado: 'Pagada' }),
            Venta.aggregate([
                {
                    $match: {
                        estado: 'Pagada'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$total'
                        }
                    }
                }
            ]),
            Agenda.find({
                fecha: {
                    $gte: new Date()
                },
                estado: {
                    $in: ['Pendiente', 'Confirmada']
                }
            })
                .populate('cliente', 'nombre apellido')
                .populate('mascota', 'nombre')
                .sort({ fecha: 1, hora: 1 })
                .limit(5),
            Venta.find({ estado: 'Pagada' })
                .sort({ fechaVenta: -1 })
                .limit(5)
        ]);

        const actividadVentas = ultimasVentas.map((venta) => ({
            descripcion: `Venta registrada por $${venta.total}`,
            fecha: venta.fechaVenta
        }));

        const citas = proximasCitas.map((cita) => ({
            fecha: cita.fecha,
            hora: cita.hora,
            cliente: cita.cliente
                ? `${cita.cliente.nombre} ${cita.cliente.apellido}`
                : 'Cliente no disponible',
            mascota: cita.mascota ? cita.mascota.nombre : 'Mascota no disponible',
            motivo: cita.motivo
        }));

        res.json({

            totalClientes,
            totalMascotas,
            totalAgenda,
            totalInventario,
            totalVentas,
            ingresosTotales: ingresos[0]?.total || 0,
            actividad: actividadVentas,
            proximasCitas: citas

        });

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};
