// Importar dependencias
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🔧 Variables de entorno cargadas:');
console.log('   - JWT_SECRET:', process.env.JWT_SECRET ? '✅ Cargada' : '❌ No encontrada');
console.log('   - MONGODB_URI:', process.env.MONGODB_URI ? '✅ Cargada' : '❌ No encontrada');
console.log('   - PORT:', process.env.PORT || 3000);

// Crear una instancia de la aplicación express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:3001', // React normalmente usa puerto 3000, así que cambiamos a 3001
  credentials: true
}));
app.use(express.json());
// Importar rutas
const userRoutes = require('./Routes/User');
// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/platforms', require('./Routes/Plataform'));
app.use('/api/categories', require('./Routes/Category'));
app.use('/api/companies', require('./Routes/Company'));
// Servir archivos estáticos (IMPORTANTE para las imágenes)
app.use('/uploads', express.static('uploads'));
app.use('/api/games', require('./Routes/Games'));
app.use('/api/cart', require('./Routes/Cart'));
app.use('/api/orders', require('./Routes/Orders'));
app.use('/api/reviews', require('./Routes/Review'));

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect('mongodb://localhost:27017/gamecommerce')
  .then(() => {
    console.log('✅ Conectado a MongoDB - gamecommerce');
    
    // Ahora que la DB está conectada, iniciamos el servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor Express escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Error de conexión a MongoDB:', err);
    process.exit(1); // Salir si no puede conectar a la DB
  });