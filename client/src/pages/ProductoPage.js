// pages/ProductoPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { gameService } from '../services/gameService';

const ProductoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del producto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await gameService.getGameById(id);
        
        if (response.success) {
          // Mapear datos del backend a la estructura del frontend
          const gameData = response.game;
          const formattedProduct = {
            _id: gameData._id,
            nombre_juego: gameData.Nombre_juego,
            precio: gameData.Precio,
            cantidad: gameData.Cantidad,
            informacion: gameData.Informacion,
            vendedor: gameData.Vendedor?.Nombre_usuario || 'Vendedor no disponible',
            platform: gameData.plataforma?.Nombre_Plataforma || 'Plataforma no especificada',
            company: gameData.compania?.Nombre_Compania || 'Compañía no especificada',
            rating: 4.5, // Temporal - puedes agregar rating a tu modelo después
            // Mapear imágenes
            images: gameData.imagenes && gameData.imagenes.length > 0 
              ? gameData.imagenes.map(img => `http://localhost:3000/uploads/${img.filename}`)
              : ['https://via.placeholder.com/600x400/4A5568/FFFFFF?text=Imagen+No+Disponible']
          };

          console.log('🔍 Datos del juego recibidos:', gameData);
          console.log('🔍 Plataforma:', gameData.plataforma);
          console.log('🔍 Categoría:', gameData.categoria);
          console.log('🔍 Compañía:', gameData.compania);
          console.log('🔍 Imágenes:', gameData.imagenes);
         // Y también actualiza el console.log:
          console.log('🔍 Vendedor:', gameData.Vendedor);
          console.log('🔍 Vendedor Nombre_usuario:', gameData.Vendedor?.Nombre_usuario);
          
          setProducto(formattedProduct);
        } else {
          setError('Error al cargar el producto');
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

    const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/auth');
      return;
    }

    if (!producto) return;

    try {
      const result = await addToCart(producto._id, cantidad);
      if (result.success) {
        alert(`${cantidad} ${producto.nombre_juego} agregado(s) al carrito`);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a lista de deseos');
      navigate('/auth');
      return;
    }
    alert(`${producto.nombre_juego} agregado a lista de deseos`);
  };

  if (loading) {
    return (
      <section className="section container">
        <div className="loading">Cargando producto...</div>
      </section>
    );
  }

  if (error || !producto) {
    return (
      <section className="section container">
        <div className="error">
          <p>{error || 'Producto no encontrado'}</p>
          <button onClick={() => navigate('/catalog')}>Volver al catálogo</button>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="producto-page">
        <div className="producto-content">
          
          {/* Columna izquierda: Galería de imágenes */}
          <aside className="producto-gallery">
            <div className="imagen-principal">
              <img 
                src={producto.images[imagenPrincipal]} 
                alt={producto.nombre_juego}
                className="producto-imagen"
              />
            </div>
            
            {producto.images.length > 1 && (
              <div className="miniaturas">
                {producto.images.map((imagen, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`miniatura-btn ${imagenPrincipal === index ? 'active' : ''}`}
                    onClick={() => setImagenPrincipal(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img 
                      src={imagen} 
                      alt={`Miniatura ${index + 1}`}
                      className="miniatura-imagen"
                    />
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* Columna derecha: Detalles del producto */}
          <main className="producto-details">
            <div className="producto-header">
              <h1>{producto.nombre_juego}</h1>
              <button 
                type="button" 
                className="wishlist-btn"
                onClick={handleAddToWishlist}
                aria-label="Agregar a favoritos"
              >
                ♡
              </button>
            </div>

            <div className="producto-platform">
              <span className="platform-badge">{producto.platform}</span>
              <div className="producto-rating">
                <span className="stars">★★★★☆</span>
                <span>({producto.rating})</span>
              </div>
            </div>

            <div className="producto-precio">
              <strong className="precio">${producto.precio} MXN</strong>
            </div>

            <section className="producto-descripcion">
              <h2>Sobre este producto:</h2>
              <p>{producto.informacion}</p>
              <ul className="producto-caracteristicas">
                <li>🎮 Plataforma: {producto.platform}</li>
                <li>🏢 Compañía: {producto.company}</li>
                <li>📦 Disponibles: {producto.cantidad} unidades</li>
                <li>🚚 Envío gratis en compras mayores a $500 MXN</li>
              </ul>
            </section>

            <form className="purchase-form" onSubmit={(e) => e.preventDefault()}>
              <div className="cantidad-group">
                <label htmlFor="cantidad">Cantidad</label>
                <div className="cantidad-controls">
                  <button 
                    type="button" 
                    className="cantidad-btn"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  >
                    -
                  </button>
                  <input 
                    id="cantidad"
                    name="cantidad" 
                    type="number" 
                    min="1" 
                    max={producto.cantidad}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                    className="cantidad-input"
                  />
                  <button 
                    type="button" 
                    className="cantidad-btn"
                    onClick={() => setCantidad(Math.min(producto.cantidad, cantidad + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="vendedor-info">
                <p>🛍️ <strong>Vendedor:</strong> {producto.vendedor}</p>
                <p>📦 <strong>Disponibles:</strong> {producto.cantidad} unidades</p>
                <p>🏢 <strong>Compañía:</strong> {producto.company}</p>
              </div>

              <div className="producto-actions">
                <button 
                  type="button" 
                  className="btn btn--primary btn--large"
                  onClick={handleAddToCart}
                  disabled={producto.cantidad === 0}
                >
                  {producto.cantidad === 0 ? '❌ Agotado' : '🛒 Agregar al Carrito'}
                </button>
                <button 
                  type="button" 
                  className="btn btn--accent btn--large"
                  disabled={producto.cantidad === 0}
                >
                  {producto.cantidad === 0 ? 'No Disponible' : '💳 Comprar Ahora'}
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </section>
  );
};

export default ProductoPage;