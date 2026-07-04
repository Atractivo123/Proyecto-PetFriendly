require('dotenv').config();

const conectarDB = require('./config/database');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const clienteRoutes = require('./routes/cliente.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const mascotaRoutes = require('./routes/mascota.routes');
const agendaRoutes = require('./routes/agenda.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const ventaRoutes = require('./routes/venta.routes');
const reporteRoutes = require('./routes/reporte.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/clientes', clienteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        mensaje: '🚀 API REST PetFriendly funcionando correctamente',
        version: '1.0.0'
    });
});

// Puerto
const PORT = process.env.PORT || 3000;

conectarDB();

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});
