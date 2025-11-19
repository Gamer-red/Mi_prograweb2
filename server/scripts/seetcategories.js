const mongoose = require('mongoose');
const Category = require('../Models/Model_category');

const categories = [
  { name: 'Acción', description: 'Juegos de acción y aventura' },
  { name: 'Aventura', description: 'Juegos de exploración y narrativa' },
  { name: 'Deportes', description: 'Juegos deportivos y de competición' },
  { name: 'Estrategia', description: 'Juegos de táctica y planificación' },
  { name: 'RPG', description: 'Juegos de rol y desarrollo de personajes' },
  { name: 'Shooter', description: 'Juegos de disparos en primera o tercera persona' },
  { name: 'Simulación', description: 'Juegos que simulan experiencias reales' },
  { name: 'Indie', description: 'Juegos desarrollados por estudios independientes' },
  { name: 'Carreras', description: 'Juegos de carreras y conducción' },
  { name: 'Lucha', description: 'Juegos de combate y artes marciales' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gamecommerce');
    console.log('✅ Conectado a MongoDB');

    // Eliminar categorías existentes
    await Category.deleteMany({});
    console.log('✅ Categorías anteriores eliminadas');

    // Insertar nuevas categorías
    await Category.insertMany(categories);
    console.log('✅ Categorías insertadas correctamente');

    // Mostrar las categorías insertadas
    const categoriasInsertadas = await Category.find();
    console.log('📋 Categorías en la base de datos:');
    categoriasInsertadas.forEach(c => {
      console.log(`   - ${c.name}: ${c.description}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedCategories();