const Category = require('../Models/Model_category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las categorías'
    });
  }
};

module.exports = {
  getCategories
};