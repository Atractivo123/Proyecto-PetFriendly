const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({

    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },

    mascota: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mascota',
        required: true
    },

    fecha: {
        type: Date,
        required: true
    },

    hora: {
        type: String,
        required: true,
        trim: true
    },

    motivo: {
        type: String,
        required: true,
        trim: true
    },

    estado: {
        type: String,
        enum: ['Pendiente', 'Confirmada', 'Cancelada', 'Atendida'],
        default: 'Pendiente',
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

module.exports = mongoose.model('Agenda', agendaSchema);