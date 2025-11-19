const Platform = require('../Models/Model_plataform');  

const getPlatforms = async (req, res) => {  
  try {
    const platforms = await Platform.find().sort({ Nombre_Plataforma: 1 });  
    
    res.json({
      success: true,
      platforms  
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las plataformas'  
    });
  }
};

module.exports = {
  getPlatforms  // ✅ getPlatforms
};