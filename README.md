# 🐾 PetFriendly - Sistema de Gestión para Veterinarias
Sistema completo de gestión para clínicas veterinarias desarrollado con Angular (Frontend) y Node.js + Express + MongoDB (Backend).
## 📋 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado:
- **Node.js** versión 18 o superior
- **npm** versión 8 o superior
- **MongoDB** versión 6 o superior (o acceso a MongoDB Atlas)
- **Angular CLI** versión 18 o superior (para el frontend)
## 🚀 Instalación y Configuración
### Backend
1. Navega a la carpeta del backend:
   ```bash
   cd Backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno:
   - Copia el archivo `.env.example` y renómbralo a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edita el archivo `.env` y configura:
     - `PORT`: Puerto donde se ejecutará el servidor (por defecto: 3000)
     - `MONGODB_URI`: URI de conexión a tu base de datos MongoDB
4. Inicia el servidor:
   ```bash
   # Para desarrollo con auto-reload
   npm run dev
   # Para producción
   npm start
   ```
El servidor estará disponible en `http://localhost:3000`
### Frontend
1. Navega a la carpeta del frontend:
   ```bash
   cd Frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. (Opcional) Configura las variables de entorno:
   - Edita `src/environments/environment.ts` para configurar la URL de la API si es diferente a `http://localhost:3000/api`
4. Inicia la aplicación:
   ```bash
   ng serve
   ```
La aplicación estará disponible en `http://localhost:4200`
## 📁 Estructura del Proyecto
```
PetFriendly/
├── Backend/
│   ├── config/          # Configuración de base de datos
│   ├── controllers/     # Controladores de la API
│   ├── models/          # Modelos de Mongoose
│   ├── routes/          # Rutas de la API
│   ├── .env.example     # Ejemplo de variables de entorno
│   ├── server.js        # Punto de entrada del servidor
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/        # Servicios y configuraciones principales
│   │   │   ├── models/      # Interfaces TypeScript
│   │   │   ├── pages/       # Componentes de páginas
│   │   │   └── shared/      # Componentes compartidos (layout, navbar, sidebar)
│   │   └── environments/    # Configuración por entorno
│   └── package.json
└── README.md
```
## 🔧 Módulos del Sistema
### Backend (API REST)
- **Clientes**: Gestión de clientes y sus datos de contacto
- **Mascotas**: Registro y seguimiento de mascotas
- **Agenda**: Programación de citas y appointments
- **Inventario**: Control de productos y medicamentos
- **Ventas**: Registro de ventas y facturación
- **Reportes**: Generación de reportes y estadísticas
- **Dashboard**: Métricas y resumen del negocio
### Frontend (Angular)
- Interfaz moderna y responsive con Material Design
- Formularios reactivos con validaciones
- Navegación intuitiva con menú lateral
- Dashboard con indicadores clave
- Gestión completa de todos los módulos
## 🔌 Endpoints de la API
| Módulo | Endpoint | Métodos |
|--------|----------|---------|
| Clientes | `/api/clientes` | GET, POST, PUT, DELETE |
| Mascotas | `/api/mascotas` | GET, POST, PUT, DELETE |
| Agenda | `/api/agenda` | GET, POST, PUT, DELETE |
| Inventario | `/api/inventario` | GET, POST, PUT, DELETE |
| Ventas | `/api/ventas` | GET, POST |
| Reportes | `/api/reportes` | GET |
| Dashboard | `/api/dashboard` | GET |
## 🛠️ Tecnologías Utilizadas
### Backend
- Node.js
- Express.js
- MongoDB con Mongoose ODM
- Middleware: CORS, Helmet, Morgan
### Frontend
- Angular 22
- TypeScript
- RxJS
- Material Design Icons
- Materialize CSS
## 📝 Notas Importantes
1. **Base de Datos**: Asegúrate de que MongoDB esté ejecutándose antes de iniciar el backend.
2. **CORS**: El backend está configurado para aceptar conexiones desde `localhost:4200` (puerto por defecto de Angular).
3. **Producción**: Para desplegar en producción:
   - Compila el frontend: `ng build --configuration production`
   - Configura las variables de entorno apropiadas
   - Usa un proceso manager como PM2 para el backend
## 👨‍💻 Desarrollo
Este proyecto fue desarrollado por **Juan Manuel Diaz y su equipo de trabajo**.
## 📄 Licencia
ISC
