const Cliente = require('../models/cliente.model');
const Inventario = require('../models/inventario.model');
const Venta = require('../models/venta.model');

const cargarDatosVenta = async (clienteId, productosVenta) => {

    const cliente = await Cliente.findById(clienteId);

    if (!cliente) {
        return {
            valido: false,
            status: 404,
            mensaje: 'El cliente seleccionado no existe.'
        };
    }

    if (!productosVenta || productosVenta.length === 0) {
        return {
            valido: false,
            status: 400,
            mensaje: 'La venta debe tener al menos un producto.'
        };
    }

    const productosIds = productosVenta.map(item => item.producto);

    const productosUnicos = new Set(productosIds.map(id => id.toString()));

    if (productosUnicos.size !== productosIds.length) {
        return {
            valido: false,
            status: 400,
            mensaje: 'No se permiten productos repetidos dentro de una misma venta.'
        };
    }

    const productosProcesados = [];
    let total = 0;

    for (const item of productosVenta) {

        if (!item.cantidad || item.cantidad <= 0) {
            return {
                valido: false,
                status: 400,
                mensaje: 'La cantidad de cada producto debe ser mayor a cero.'
            };
        }

        const producto = await Inventario.findById(item.producto);

        if (!producto) {
            return {
                valido: false,
                status: 404,
                mensaje: `El producto '${item.producto}' no existe.`
            };
        }

        if (producto.estado !== 'Activo') {
            return {
                valido: false,
                status: 400,
                mensaje: `El producto '${producto.nombre}' se encuentra inactivo.`
            };
        }

        if (producto.stock < item.cantidad) {
            return {
                valido: false,
                status: 400,
                mensaje: `Stock insuficiente para el producto '${producto.nombre}'. Disponible: ${producto.stock} unidades.`
            };
        }

        const precioUnitario = producto.precio;
        const subtotal = precioUnitario * item.cantidad;

        productosProcesados.push({
            producto: producto._id,
            cantidad: item.cantidad,
            precioUnitario,
            subtotal,
            productoInventario: producto
        });

        total += subtotal;

    }

    return {
        valido: true,
        cliente,
        productosProcesados,
        total
    };

};

const descontarStock = async (productosProcesados) => {

    for (const item of productosProcesados) {

        item.productoInventario.stock -= item.cantidad;

        await item.productoInventario.save();

    }

};

const restaurarStock = async (productosVenta) => {

    for (const item of productosVenta) {

        await Inventario.findByIdAndUpdate(
            item.producto,
            {
                $inc: {
                    stock: item.cantidad
                }
            },
            {
                runValidators: true
            }
        );

    }

};

const poblarVenta = (query) => {
    return query
        .populate('cliente', 'nombre apellido documento telefono')
        .populate('productos.producto', 'nombre categoria precio stock estado');
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
    try {
        const ventas = await poblarVenta(
            Venta.find().sort({ createdAt: -1 })
        );

        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las ventas',
            error: error.message
        });
    }
};

// Obtener una venta por ID
exports.obtenerVenta = async (req, res) => {
    try {
        const venta = await poblarVenta(
            Venta.findById(req.params.id)
        );

        if (!venta) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        res.json(venta);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Crear venta
exports.crearVenta = async (req, res) => {
    try {
        const validacion = await cargarDatosVenta(
            req.body.cliente,
            req.body.productos
        );

        if (!validacion.valido) {
            return res.status(validacion.status).json({
                mensaje: validacion.mensaje
            });
        }

        await descontarStock(validacion.productosProcesados);

        const venta = new Venta({
            cliente: req.body.cliente,
            productos: validacion.productosProcesados.map(item => ({
                producto: item.producto,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario,
                subtotal: item.subtotal
            })),
            total: validacion.total,
            metodoPago: req.body.metodoPago,
            estado: 'Pagada',
            fechaVenta: req.body.fechaVenta || Date.now(),
            observaciones: req.body.observaciones
        });

        await venta.save();

        const ventaCreada = await poblarVenta(
            Venta.findById(venta._id)
        );

        res.status(201).json(ventaCreada);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Anular venta
exports.anularVenta = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id);

        if (!venta) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        if (venta.estado === 'Anulada') {
            return res.status(400).json({
                mensaje: 'La venta ya se encuentra anulada.'
            });
        }

        await restaurarStock(venta.productos);

        venta.estado = 'Anulada';
        venta.fechaAnulacion = new Date();

        await venta.save();

        const ventaAnulada = await poblarVenta(
            Venta.findById(venta._id)
        );

        res.json(ventaAnulada);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};