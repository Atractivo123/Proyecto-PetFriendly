const Inventario = require('../models/inventario.model');

// Obtener todos los productos
exports.obtenerInventario = async (req, res) => {
    try {
        const productos = await Inventario.find().sort({ createdAt: -1 });

        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el inventario',
            error: error.message
        });
    }
};

// Obtener un producto por ID
exports.obtenerProducto = async (req, res) => {
    try {
        const producto = await Inventario.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Crear producto
exports.crearProducto = async (req, res) => {
    try {
        const producto = new Inventario(req.body);

        await producto.save();

        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const producto = await Inventario.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(producto);
    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Inventario.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};