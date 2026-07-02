const Cliente = require('../models/cliente.model');

// Obtener todos los clientes
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().sort({ createdAt: -1 });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los clientes',
            error: error.message
        });
    }
};

// Obtener un cliente por ID
exports.obtenerCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.json(cliente);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Crear cliente
exports.crearCliente = async (req, res) => {

    try {

        const cliente = new Cliente(req.body);

        await cliente.save();

        res.status(201).json(cliente);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

// Actualizar cliente
exports.actualizarCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        if (!cliente) {

            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });

        }

        res.json(cliente);

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {

    try {

        const cliente = await Cliente.findByIdAndDelete(req.params.id);

        if (!cliente) {

            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });

        }

        res.json({
            mensaje: 'Cliente eliminado correctamente'
        });

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};