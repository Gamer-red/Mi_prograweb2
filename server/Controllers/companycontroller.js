const Company = require('../Models/Model_company');

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ Nombre_compania: 1 });
    
    res.json({
      success: true,
      companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las compañías'
    });
  }
};

// ✅ Asegúrate de exportar correctamente
module.exports = {
  getCompanies
};