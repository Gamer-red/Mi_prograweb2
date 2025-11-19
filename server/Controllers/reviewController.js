const Review = require('../Models/Model_reviews');
const Order = require('../Models/Model_orders');

// Crear una review
const createReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameId, orderId, calificacion, comentario } = req.body;

    console.log('📝 Creando review para usuario:', userId);

    // Validar que el usuario haya comprado el juego
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      'items.game': gameId
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        error: 'No puedes review un juego que no has comprado'
      });
    }

    // Verificar si ya existe una review para este juego
    const existingReview = await Review.findOne({
      game: gameId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Ya has review este juego'
      });
    }

    // Crear la review
    const newReview = new Review({
      calificacion,
      comentario,
      game: gameId,
      user: userId,
      order: orderId
    });

    const savedReview = await newReview.save();
    
    // Popular la review con datos del usuario
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'Nombre_usuario');

    console.log('✅ Review creada:', savedReview._id);

    res.status(201).json({
      success: true,
      message: 'Review creada exitosamente',
      review: populatedReview
    });

  } catch (error) {
    console.error('❌ Error creando review:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Ya has review este juego'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al crear la review'
    });
  }
};

// Obtener reviews de un juego
const getGameReviews = async (req, res) => {
  try {
    const { gameId } = req.params;

    const reviews = await Review.find({ game: gameId })
      .populate('user', 'Nombre_usuario')
      .sort({ createdAt: -1 });

    // Calcular promedio de calificaciones
    const averageRating = await Review.aggregate([
      { $match: { game: mongoose.Types.ObjectId(gameId) } },
      { $group: { _id: '$game', average: { $avg: '$calificacion' } } }
    ]);

    res.json({
      success: true,
      reviews: reviews,
      averageRating: averageRating.length > 0 ? averageRating[0].average : 0,
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las reviews'
    });
  }
};

// Obtener reviews del usuario
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviews = await Review.find({ user: userId })
      .populate('game', 'Nombre_juego imagenes')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews: reviews
    });

  } catch (error) {
    console.error('❌ Error obteniendo reviews del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener tus reviews'
    });
  }
};

// Actualizar review
const updateReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const { calificacion, comentario } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review no encontrada'
      });
    }

    review.calificacion = calificacion;
    review.comentario = comentario;

    const updatedReview = await review.save();

    res.json({
      success: true,
      message: 'Review actualizada exitosamente',
      review: updatedReview
    });

  } catch (error) {
    console.error('❌ Error actualizando review:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la review'
    });
  }
};

// Eliminar review
const deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Review eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando review:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar la review'
    });
  }
};

module.exports = {
  createReview,
  getGameReviews,
  getUserReviews,
  updateReview,
  deleteReview
};