// Controllers/orderController.js
const Order = require('../Models/Model_orders');
const Cart = require('../Models/Model_cart');
const Games = require('../Models/Model_games');

// Crear orden desde el carrito
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { metodoPago } = req.body;

    console.log('🛒 Creando orden para usuario:', userId);
    console.log('💳 Método de pago:', metodoPago);

    // 1. Obtener carrito del usuario
    const cart = await Cart.findOne({ user: userId })
      .populate('items.game', 'Nombre_juego Vendedor Cantidad Precio');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El carrito está vacío'
      });
    }

    // 2. Validar stock y preparar items de la orden
    const orderItems = [];
    
    for (const cartItem of cart.items) {
      const game = cartItem.game;
      
      // Validar stock
      if (game.Cantidad < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Stock insuficiente para ${game.Nombre_juego}. Disponible: ${game.Cantidad}`
        });
      }

      orderItems.push({
        game: game._id,
        nombreJuego: game.Nombre_juego,
        vendedor: game.Vendedor,
        cantidad: cartItem.quantity,
        precio: cartItem.price,
        subtotal: cartItem.price * cartItem.quantity
      });
    }

    // 3. Crear la orden
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      total: cart.total,
      metodoPago: metodoPago
    });

    const savedOrder = await newOrder.save();
    console.log('✅ Orden creada:', savedOrder._id);

    // 4. Actualizar stock de juegos
    for (const cartItem of cart.items) {
      await Games.findByIdAndUpdate(
        cartItem.game._id,
        { $inc: { Cantidad: -cartItem.quantity } }
      );
    }

    // 5. Vaciar carrito
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], total: 0 }
    );

    // 6. Responder con la orden creada
    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      order: savedOrder
    });

  } catch (error) {
    console.error('❌ Error creando orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la orden'
    });
  }
};

// Obtener órdenes del usuario
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ user: userId })
      .populate('items.game', 'Nombre_juego imagenes')
      .sort({ fecha: -1 });

    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las órdenes'
    });
  }
};

// Obtener ventas del vendedor
const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    
    // Buscar órdenes que tengan items de este vendedor
    const orders = await Order.find({ 
      'items.vendedor': vendorId 
    })
    .populate('user', 'Nombre_usuario Correo')
    .populate('items.game', 'Nombre_juego imagenes')
    .sort({ fecha: -1 });

    res.json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Error obteniendo ventas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las ventas'
    });
  }
};

const getVentasVendedor = async (req, res) => {
  try {
    const vendedorId = req.user._id;
    const { fechaInicio, fechaFin } = req.query;
    
    // Construir filtro de fechas
    let filtroFecha = {};
    if (fechaInicio || fechaFin) {
      filtroFecha.fecha = {};
      if (fechaInicio) filtroFecha.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) {
        const fechaFinObj = new Date(fechaFin);
        fechaFinObj.setHours(23, 59, 59, 999);
        filtroFecha.fecha.$lte = fechaFinObj;
      }
    }

    // Obtener órdenes donde este vendedor tenga productos
    const orders = await Order.find({
      ...filtroFecha,
      'items.vendedor': vendedorId
    })
    .populate('user', 'Nombre_usuario')
    .populate('items.game', 'Nombre_juego imagenes')
    .sort({ fecha: -1 });

    // Procesar datos para el reporte del vendedor
    const ventas = [];
    let ventasTotales = 0;
    let productosVendidos = 0;
    const ordenesUnicas = new Set();

    orders.forEach(order => {
      ordenesUnicas.add(order._id.toString());
      
      // Filtrar solo los items de este vendedor
      const itemsDelVendedor = order.items.filter(item => 
        item.vendedor.toString() === vendedorId.toString()
      );

      itemsDelVendedor.forEach(item => {
        ventas.push({
          ordenId: order._id,
          comprador: order.user?.Nombre_usuario || 'N/A',
          nombreJuego: item.nombreJuego,
          cantidad: item.cantidad,
          precio: item.precio,
          subtotal: item.subtotal,
          fecha: order.fecha
        });

        ventasTotales += item.subtotal;
        productosVendidos += item.cantidad;
      });
    });

    const estadisticas = {
      ventasTotales,
      productosVendidos,
      ordenesTotales: ordenesUnicas.size,
      promedioPorVenta: ventas.length > 0 ? ventasTotales / ventas.length : 0
    };

    res.json({
      success: true,
      ventas,
      estadisticas
    });

  } catch (error) {
    console.error('Error obteniendo ventas del vendedor:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el reporte de ventas'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getVendorOrders,
  getVentasVendedor
};