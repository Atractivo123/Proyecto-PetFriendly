const Cliente = require('../models/cliente.model');
const Mascota = require('../models/mascota.model');
const Agenda = require('../models/agenda.model');
const Inventario = require('../models/inventario.model');
const Venta = require('../models/venta.model');

// Reporte general para dashboard
exports.obtenerReporteDashboard = async (req, res) => {
    try {
        const totalClientes = await Cliente.countDocuments();

        const totalMascotas = await Mascota.countDocuments();

        const totalCitas = await Agenda.countDocuments();

        const totalProductos = await Inventario.countDocuments();

        const totalVentas = await Venta.countDocuments({
            estado: 'Pagada'
        });

        const ingresos = await Venta.aggregate([
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
        ]);

        res.status(200).json({
            totalClientes,
            totalMascotas,
            totalCitas,
            totalProductos,
            totalVentas,
            ingresosTotales: ingresos[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el reporte general',
            error: error.message
        });
    }
};

// Reporte de ventas
exports.obtenerReporteVentas = async (req, res) => {
    try {
        const filtros = {};

        if (req.query.estado) {
            filtros.estado = req.query.estado;
        }

        if (req.query.metodoPago) {
            filtros.metodoPago = req.query.metodoPago;
        }

        if (req.query.fechaInicio || req.query.fechaFin) {
            filtros.fechaVenta = {};

            if (req.query.fechaInicio) {
                filtros.fechaVenta.$gte = new Date(req.query.fechaInicio);
            }

            if (req.query.fechaFin) {
                filtros.fechaVenta.$lte = new Date(req.query.fechaFin);
            }
        }

        const totalVentas = await Venta.countDocuments({
            ...filtros,
            estado: 'Pagada'
        });

        const ventasAnuladas = await Venta.countDocuments({
            ...filtros,
            estado: 'Anulada'
        });

        const ingresos = await Venta.aggregate([
            {
                $match: {
                    ...filtros,
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
        ]);

        const ventasPorMetodoPago = await Venta.aggregate([
            {
                $match: filtros
            },
            {
                $group: {
                    _id: '$metodoPago',
                    totalVentas: {
                        $sum: 1
                    },
                    ingresos: {
                        $sum: {
                            $cond: [
                                { $eq: ['$estado', 'Pagada'] },
                                '$total',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    totalVentas: -1
                }
            }
        ]);

        res.status(200).json({
            totalVentas,
            ventasAnuladas,
            ingresosTotales: ingresos[0]?.total || 0,
            ventasPorMetodoPago
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el reporte de ventas',
            error: error.message
        });
    }
};

// Reporte de inventario
exports.obtenerReporteInventario = async (req, res) => {
    try {
        const totalProductos = await Inventario.countDocuments();

        const productosActivos = await Inventario.countDocuments({
            estado: 'Activo'
        });

        const productosInactivos = await Inventario.countDocuments({
            estado: 'Inactivo'
        });

        const productosBajoStock = await Inventario.find({
            $expr: {
                $lte: ['$stock', '$stockMinimo']
            },
            stock: {
                $gt: 0
            }
        })
            .select('nombre categoria stock stockMinimo estado')
            .sort({ stock: 1 });

        const productosSinStock = await Inventario.find({
            stock: 0
        })
            .select('nombre categoria stock stockMinimo estado')
            .sort({ nombre: 1 });

        res.status(200).json({
            totalProductos,
            productosActivos,
            productosInactivos,
            totalBajoStock: productosBajoStock.length,
            totalSinStock: productosSinStock.length,
            productosBajoStock,
            productosSinStock
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el reporte de inventario',
            error: error.message
        });
    }
};

// Reporte de agenda
exports.obtenerReporteAgenda = async (req, res) => {
    try {
        const filtros = {};

        if (req.query.estado) {
            filtros.estado = req.query.estado;
        }

        if (req.query.fechaInicio || req.query.fechaFin) {
            filtros.fecha = {};

            if (req.query.fechaInicio) {
                filtros.fecha.$gte = new Date(req.query.fechaInicio);
            }

            if (req.query.fechaFin) {
                filtros.fecha.$lte = new Date(req.query.fechaFin);
            }
        }

        const totalCitas = await Agenda.countDocuments(filtros);

        const citasPendientes = await Agenda.countDocuments({
            ...filtros,
            estado: 'Pendiente'
        });

        const citasConfirmadas = await Agenda.countDocuments({
            ...filtros,
            estado: 'Confirmada'
        });

        const citasAtendidas = await Agenda.countDocuments({
            ...filtros,
            estado: 'Atendida'
        });

        const citasCanceladas = await Agenda.countDocuments({
            ...filtros,
            estado: 'Cancelada'
        });

        const citasPorEstado = await Agenda.aggregate([
            {
                $match: filtros
            },
            {
                $group: {
                    _id: '$estado',
                    total: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    total: -1
                }
            }
        ]);

        res.status(200).json({
            totalCitas,
            citasPendientes,
            citasConfirmadas,
            citasAtendidas,
            citasCanceladas,
            citasPorEstado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el reporte de agenda',
            error: error.message
        });
    }
};

// Reporte de clientes y mascotas
exports.obtenerReporteClientes = async (req, res) => {
    try {
        const totalClientes = await Cliente.countDocuments();

        const totalMascotas = await Mascota.countDocuments();

        const promedioMascotasPorCliente = totalClientes > 0
            ? Number((totalMascotas / totalClientes).toFixed(2))
            : 0;

        const clientesConMasMascotas = await Mascota.aggregate([
            {
                $group: {
                    _id: '$cliente',
                    totalMascotas: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    totalMascotas: -1
                }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'clientes',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cliente'
                }
            },
            {
                $unwind: '$cliente'
            },
            {
                $project: {
                    _id: 0,
                    clienteId: '$cliente._id',
                    nombre: '$cliente.nombre',
                    apellido: '$cliente.apellido',
                    documento: '$cliente.documento',
                    totalMascotas: 1
                }
            }
        ]);

        res.status(200).json({
            totalClientes,
            totalMascotas,
            promedioMascotasPorCliente,
            clientesConMasMascotas
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el reporte de clientes',
            error: error.message
        });
    }
};