const mongoose = require('mongoose');

const ventaProductoSchema = new mongoose.Schema({

    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventario',
        required: true
    },

    cantidad: {
        type: Number,
        required: true,
        min: 1
    },

    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    }

}, {
    _id: false
});

const ventaSchema = new mongoose.Schema({

    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },

    productos: {
        type: [ventaProductoSchema],
        required: true,
        validate: {
            validator: function(productos) {
                return productos.length > 0;
            },
            message: 'La venta debe tener al menos un producto'
        }
    },

    total: {
        type: Number,
        required: true,
        min: 0
    },

    metodoPago: {
        type: String,
        enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'],
        required: true
    },

    estado: {
        type: String,
        enum: ['Pagada', 'Anulada'],
        default: 'Pagada',
        required: true
    },

    fechaVenta: {
        type: Date,
        default: Date.now,
        required: true
    },

    fechaAnulacion: {
        type: Date
    },

    observaciones: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Venta', ventaSchema);