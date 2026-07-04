const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    categoria: {
        type: String,
        required: true,
        enum: [
            'Medicamentos',
            'Alimentos',
            'Accesorios',
            'Higiene',
            'Servicios',
            'Otros'
        ]
    },

    descripcion: {
        type: String,
        trim: true
    },

    precio: {
        type: Number,
        required: true,
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    stockMinimo: {
        type: Number,
        required: true,
        min: 0
    },

    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo',
        required: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model('Inventario', inventarioSchema);