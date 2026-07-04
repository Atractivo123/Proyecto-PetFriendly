const mongoose = require('mongoose');

const mascotaSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },

    especie: {
        type: String,
        required: true,
        trim: true
    },

    raza: {
        type: String,
        trim: true
    },

    edad: {
        type: Number,
        min: 0
    },

    sexo: {
        type: String,
        enum: ['Macho', 'Hembra'],
        required: true
    },

    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },

    observaciones: {
        type: String,
        trim: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model('Mascota', mascotaSchema);
