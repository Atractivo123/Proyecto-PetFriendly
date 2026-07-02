const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    apellido: {
        type: String,
        required: true,
        trim: true
    },

    documento: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    telefono: {
        type: String,
        required: true
    },

    correo: {
        type: String,
        required: true,
        lowercase: true
    },

    direccion: {
        type: String
    }

},
{
    timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);