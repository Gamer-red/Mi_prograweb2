const Cart = require('../Models/Model_cart');
const Games = require('../Models/Model_games');

// Obtener carrito del usuario
const getCart = async (req, res) => {
  try {
    console.log('🔍 USER en getCart:', req.user._id);
    
    const userId = req.user._id;

    // Buscar carrito existente con populate COMPLETO
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.game',
        select: 'Nombre_juego Precio Cantidad imagenes',
        populate: { path: 'imagenes', model: 'Media' }
      });

    console.log('🛒 Carrito encontrado:', cart ? '✅ Sí' : '❌ No');

    // Si no existe, crear uno nuevo
    if (!cart) {
      console.log('🛒 Creando nuevo carrito para usuario:', userId);
      
      const newCart = new Cart({
        user: userId,
        items: [],
        total: 0
      });

      const savedCart = await newCart.save();

      await savedCart.populate({
        path: 'items.game',
        select: 'Nombre_juego Precio Cantidad imagenes',
        populate: { path: 'imagenes', model: 'Media' }
      });

      return res.json(savedCart);
    }

    // Validar stock
    const validItems = [];
    let newTotal = 0;

    for (const item of cart.items) {
      const game = await Games.findById(item.game);
      
      if (game && game.Cantidad >= item.quantity) {
        validItems.push(item);
        newTotal += item.price * item.quantity;
      }
    }

    // Actualizar si hay cambios
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.total = newTotal;
      cart.updatedAt = new Date();
      await cart.save();
    }

    // Repopulate con imágenes completas
    await cart.populate({
      path: 'items.game',
      select: 'Nombre_juego Precio Cantidad imagenes',
      populate: { path: 'imagenes', model: 'Media' }
    });

    console.log('🛒 Carrito enviado al frontend:', cart.items.length, 'items');
    res.json(cart);

  } catch (error) {
    console.error('❌ Error en getCart:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener el carrito' 
    });
  }
};

// Agregar juego al carrito
const addToCart = async (req, res) => {
  try {
    const { gameId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!gameId) {
      return res.status(400).json({ success: false, error: 'ID del juego requerido' });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, error: 'La cantidad debe ser al menos 1' });
    }

    const game = await Games.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Juego no encontrado' });
    }

    if (game.Cantidad < quantity) {
      return res.status(400).json({ success: false, error: `Stock insuficiente. Solo quedan ${game.Cantidad} unidades` });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], total: 0 });
    }

    const existingItemIndex = cart.items.findIndex(item => item.game.toString() === gameId);

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (game.Cantidad < newQuantity) {
        return res.status(400).json({ success: false, error: 'Stock insuficiente. No puedes agregar más unidades' });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = game.Precio;
    } else {
      cart.items.push({ game: gameId, quantity: quantity, price: game.Precio });
    }

    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    const savedCart = await cart.save();
    await savedCart.populate({
      path: 'items.game',
      select: 'Nombre_juego Precio Cantidad imagenes',
      populate: { path: 'imagenes', model: 'Media' }
    });

    res.status(201).json({ success: true, message: 'Juego agregado al carrito', cart: savedCart });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Actualizar cantidad de un item
const updateCartItem = async (req, res) => {
  try {
    const { gameId, quantity } = req.body;
    const userId = req.user._id;

    if (!gameId || quantity === undefined) {
      return res.status(400).json({ success: false, error: 'ID del juego y cantidad requeridos' });
    }

    if (quantity < 1) {
      return res.status(400).json({ success: false, error: 'La cantidad debe ser al menos 1' });
    }

    const game = await Games.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Juego no encontrado' });
    }

    if (game.Cantidad < quantity) {
      return res.status(400).json({ success: false, error: `Stock insuficiente. Solo quedan ${game.Cantidad} unidades` });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    const itemIndex = cart.items.findIndex(item => item.game.toString() === gameId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Juego no encontrado en el carrito' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = game.Precio;
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    const updatedCart = await cart.save();
    await updatedCart.populate({
      path: 'items.game',
      select: 'Nombre_juego Precio Cantidad imagenes',
      populate: { path: 'imagenes', model: 'Media' }
    });

    res.json({ success: true, message: 'Carrito actualizado', cart: updatedCart });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Remover item del carrito
const removeFromCart = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;

    if (!gameId) {
      return res.status(400).json({ success: false, error: 'ID del juego requerido' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.game.toString() !== gameId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Juego no encontrado en el carrito' });
    }

    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();

    const updatedCart = await cart.save();
    await updatedCart.populate({
      path: 'items.game',
      select: 'Nombre_juego Precio Cantidad imagenes',
      populate: { path: 'imagenes', model: 'Media' }
    });

    res.json({ success: true, message: 'Juego removido del carrito', cart: updatedCart });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Vaciar el carrito
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Carrito no encontrado' });
    }

    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();

    const clearedCart = await cart.save();

    res.json({ success: true, message: 'Carrito vaciado', cart: clearedCart });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al vaciar el carrito' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
