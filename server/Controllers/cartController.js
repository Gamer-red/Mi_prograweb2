// Controllers/cartController.js
const Cart = require('../Models/Model_cart');
const Games = require('../Models/Model_games');

// Obtener carrito del usuario
const getCart = async (req, res) => {
  try {
    console.log('🔍 USER en getCart:', req.user._id);
    
    const userId = req.user._id;

    // ✅ PRIMERO buscar el carrito existente
    let cart = await Cart.findOne({ user: userId })
      .populate('items.game', 'Nombre_juego Precio imagenes Cantidad');

    console.log('🛒 Carrito encontrado:', cart ? '✅ Sí' : '❌ No');

    // ✅ SI NO EXISTE, crear uno nuevo
    if (!cart) {
      console.log('🛒 Creando nuevo carrito para usuario:', userId);
      try {
        const newCart = new Cart({
          user: userId,
          items: [],
          total: 0
        });
        const savedCart = await newCart.save();
        await savedCart.populate('items.game', 'Nombre_juego Precio imagenes Cantidad');
        console.log('🛒 Nuevo carrito creado:', savedCart._id);
        return res.json(savedCart);
      } catch (createError) {
        // ✅ Si falla la creación, probablemente ya existe, buscar de nuevo
        console.log('🛒 Error creando carrito, buscando nuevamente:', createError.message);
        cart = await Cart.findOne({ user: userId })
          .populate('items.game', 'Nombre_juego Precio imagenes Cantidad');
        
        if (!cart) {
          throw createError;
        }
      }
    }

    // Verificar que los juegos aún existan y tengan stock
    const validItems = [];
    let newTotal = 0;

    for (const item of cart.items) {
      const game = await Games.findById(item.game);
      if (game && game.Cantidad >= item.quantity) {
        validItems.push(item);
        newTotal += item.price * item.quantity;
      }
    }

    // Actualizar carrito si hay items inválidos
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.total = newTotal;
      cart.updatedAt = new Date();
      await cart.save();
    }

    await cart.populate('items.game', 'Nombre_juego Precio imagenes Cantidad');
    
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

    // Validaciones
    if (!gameId) {
      return res.status(400).json({ 
        success: false,
        error: 'ID del juego requerido' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false,
        error: 'La cantidad debe ser al menos 1' 
      });
    }

    // Verificar que el juego existe y tiene stock
    const game = await Games.findById(gameId);
    if (!game) {
      return res.status(404).json({ 
        success: false,
        error: 'Juego no encontrado' 
      });
    }

    if (game.Cantidad < quantity) {
      return res.status(400).json({ 
        success: false,
        error: `Stock insuficiente. Solo quedan ${game.Cantidad} unidades` 
      });
    }

    // Buscar o crear carrito
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        total: 0
      });
    }

    // Verificar si el juego ya está en el carrito
    const existingItemIndex = cart.items.findIndex(
      item => item.game.toString() === gameId
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad si ya existe
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (game.Cantidad < newQuantity) {
        return res.status(400).json({ 
          success: false,
          error: `Stock insuficiente. No puedes agregar más unidades` 
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = game.Precio;
    } else {
      // Agregar nuevo item
      cart.items.push({
        game: gameId,
        quantity: quantity,
        price: game.Precio
      });
    }

    // Calcular total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();

    const savedCart = await cart.save();
    await savedCart.populate('items.game', 'Nombre_juego Precio imagenes Cantidad');

    res.status(201).json({
      success: true,
      message: 'Juego agregado al carrito',
      cart: savedCart
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Actualizar cantidad de un item
const updateCartItem = async (req, res) => {
  try {
    const { gameId, quantity } = req.body;
    const userId = req.user._id;

    if (!gameId || quantity === undefined) {
      return res.status(400).json({ 
        success: false,
        error: 'ID del juego y cantidad requeridos' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false,
        error: 'La cantidad debe ser al menos 1' 
      });
    }

    // Verificar stock
    const game = await Games.findById(gameId);
    if (!game) {
      return res.status(404).json({ 
        success: false,
        error: 'Juego no encontrado' 
      });
    }

    if (game.Cantidad < quantity) {
      return res.status(400).json({ 
        success: false,
        error: `Stock insuficiente. Solo quedan ${game.Cantidad} unidades` 
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Carrito no encontrado' 
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.game.toString() === gameId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Juego no encontrado en el carrito' 
      });
    }

    // Actualizar cantidad y precio
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = game.Precio;

    // Recalcular total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();

    const updatedCart = await cart.save();
    await updatedCart.populate('items.game', 'Nombre_juego Precio imagenes Cantidad');

    res.json({
      success: true,
      message: 'Carrito actualizado',
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Remover item del carrito
const removeFromCart = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.user._id;

    if (!gameId) {
      return res.status(400).json({ 
        success: false,
        error: 'ID del juego requerido' 
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Carrito no encontrado' 
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item => item.game.toString() !== gameId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        error: 'Juego no encontrado en el carrito' 
      });
    }

    // Recalcular total
    cart.total = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    cart.updatedAt = new Date();

    const updatedCart = await cart.save();
    await updatedCart.populate('items.game', 'Nombre_juego Precio imagenes Cantidad');

    res.json({
      success: true,
      message: 'Juego removido del carrito',
      cart: updatedCart
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Vaciar el carrito
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Carrito no encontrado' 
      });
    }

    cart.items = [];
    cart.total = 0;
    cart.updatedAt = new Date();

    const clearedCart = await cart.save();

    res.json({
      success: true,
      message: 'Carrito vaciado',
      cart: clearedCart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error al vaciar el carrito' 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};