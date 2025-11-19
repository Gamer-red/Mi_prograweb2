import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DetalleCompra = () => {
  const { id } = useParams();
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [compra, setCompra] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [enviandoReview, setEnviandoReview] = useState(false);
  const [gameReviews, setGameReviews] = useState({});
  const [userReviews, setUserReviews] = useState({}); // Nuevo estado para almacenar las reviews del usuario

  useEffect(() => {
    obtenerDetalleCompra();
  }, [id]);

  const obtenerDetalleCompra = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const compraEncontrada = response.data.orders.find(order => order._id === id);
        
        if (compraEncontrada) {
          setCompra(compraEncontrada);
          // Obtener reviews para cada juego de la compra
          await obtenerReviewsDeJuegos(compraEncontrada.items);
          // Obtener las reviews del usuario para esta compra
          await obtenerReviewsDelUsuario(compraEncontrada.items);
        } else {
          setError('Compra no encontrada');
        }
      }
    } catch (error) {
      console.error('Error obteniendo detalle:', error);
      setError('Error al cargar el detalle de la compra');
    } finally {
      setCargando(false);
    }
  };

  const obtenerReviewsDeJuegos = async (items) => {
    const token = localStorage.getItem('token');
    const reviewsMap = {};

    for (const item of items) {
      try {
        const response = await axios.get(`/api/reviews/game/${item.game._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          reviewsMap[item.game._id] = response.data;
        }
      } catch (error) {
        console.error(`Error obteniendo reviews para juego ${item.game._id}:`, error);
        reviewsMap[item.game._id] = { reviews: [], averageRating: 0, totalReviews: 0 };
      }
    }

    setGameReviews(reviewsMap);
  };

  // Nueva función para obtener las reviews del usuario para cada juego
  const obtenerReviewsDelUsuario = async (items) => {
    const token = localStorage.getItem('token');
    const userReviewsMap = {};

    for (const item of items) {
      try {
        const response = await axios.get(`/api/reviews/user-game/${item.game._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success && response.data.review) {
          // El usuario ya tiene una review para este juego
          userReviewsMap[item.game._id] = response.data.review;
        } else {
          // El usuario no tiene review para este juego
          userReviewsMap[item.game._id] = null;
        }
      } catch (error) {
        console.error(`Error verificando review del usuario para juego ${item.game._id}:`, error);
        userReviewsMap[item.game._id] = null;
      }
    }

    setUserReviews(userReviewsMap);
  };

  // Función para verificar si el usuario ya reviewó un juego específico
  const usuarioYaReviewo = (gameId) => {
    return userReviews[gameId] !== null && userReviews[gameId] !== undefined;
  };

  const handleSubmitReview = async (e, gameId) => {
    e.preventDefault();
    
    // Validación adicional por si acaso
    if (usuarioYaReviewo(gameId)) {
      alert('❌ Ya has calificado este juego. No puedes enviar otra review.');
      return;
    }
    
    if (!comentario.trim()) {
      alert('Por favor escribe un comentario');
      return;
    }

    try {
      setEnviandoReview(true);
      const token = localStorage.getItem('token');

      const response = await axios.post('/api/reviews', {
        gameId: gameId,
        orderId: compra._id,
        calificacion: calificacion,
        comentario: comentario
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('✅ ¡Review enviada exitosamente!');
        setComentario('');
        setCalificacion(5);
        // Recargar reviews
        await obtenerReviewsDeJuegos(compra.items);
        await obtenerReviewsDelUsuario(compra.items);
      }
    } catch (error) {
      console.error('Error enviando review:', error);
      if (error.response?.status === 400 && error.response?.data?.error?.includes('Ya has review')) {
        alert('❌ Ya has calificado este juego anteriormente.');
        // Actualizar las reviews del usuario
        await obtenerReviewsDelUsuario(compra.items);
      } else {
        alert(error.response?.data?.error || 'Error al enviar la review');
      }
    } finally {
      setEnviandoReview(false);
    }
  };

  const handleCalificacionClick = (estrellas) => {
    setCalificacion(estrellas);
  };

  const renderEstrellas = (numeroEstrellas, interactivo = false, onStarClick = null) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={`estrella ${i <= numeroEstrellas ? 'activa' : ''} ${interactivo ? 'interactiva' : ''}`}
          onClick={interactivo ? () => onStarClick ? onStarClick(i) : handleCalificacionClick(i) : undefined}
          style={{ cursor: interactivo ? 'pointer' : 'default' }}
        >
          {i <= numeroEstrellas ? '★' : '☆'}
        </span>
      );
    }
    return estrellas;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearPrecio = (precio) => {
    return `$${precio.toFixed(2)} MXN`;
  };

  if (cargando) {
    return (
      <section className="section container">
        <div className="cargando">
          <h2>Cargando detalle de compra...</h2>
        </div>
      </section>
    );
  }

  if (error || !compra) {
    return (
      <section className="section container">
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error || 'No se pudo cargar la compra'}</p>
          <Link to="/historial-compras" className="btn btn--primary">
            ↩️ Volver al Historial
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="detalle-compra">
        <div className="section__head">
          <h2>📦 Detalle de Compra</h2>
          <p>Orden #{compra._id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="compra-content">
          {/* Información de los productos comprados */}
          {compra.items.map((item, index) => (
            <div key={index}>
              <section className="producto-section">
                <div className="producto-header-corregido">
                  <div className="producto-imagen-corregido">
                    <img 
                      src={item.game?.imagenes?.[0] || 'https://via.placeholder.com/150'} 
                      alt={item.nombreJuego}
                      className="imagen-producto-corregido"
                    />
                  </div>
                  <div className="producto-info-corregido">
                    <p className="fecha-compra">
                      🛒 Comprado el: <strong>{formatearFecha(compra.fecha)}</strong>
                    </p>
                    <h3>{item.nombreJuego}</h3>
                    <p className="plataforma">Cantidad: {item.cantidad}</p>
                    <div className="estado-compra">
                      <span className="estado-badge entregado">
                        Entregado
                      </span>
                    </div>
                    
                    {/* Rating promedio del juego */}
                    {gameReviews[item.game._id] && (
                      <div className="rating-promedio">
                        <div className="estrellas-promedio">
                          {renderEstrellas(Math.round(gameReviews[item.game._id].averageRating))}
                        </div>
                        <span className="rating-texto">
                          ({gameReviews[item.game._id].averageRating.toFixed(1)} de 5 - {gameReviews[item.game._id].totalReviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* Mostrar si el usuario ya reviewó este juego */}
                    {usuarioYaReviewo(item.game._id) && (
                      <div className="review-existente">
                        <div className="alert alert-info">
                          <strong>✅ Ya calificaste este juego</strong>
                          <div className="tu-calificacion">
                            <span>Tu calificación: </span>
                            <div className="estrellas-usuario">
                              {renderEstrellas(userReviews[item.game._id].calificacion)}
                            </div>
                            <p className="tu-comentario">
                              "<em>{userReviews[item.game._id].comentario}</em>"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Sección de review para este juego - Solo mostrar si no ha sido reviewado */}
              {!usuarioYaReviewo(item.game._id) ? (
                <section className="calificacion-section">
                  <h3>⭐ Califica este Juego</h3>
                  <div className="calificacion-content">
                    <div className="estrellas-calificacion">
                      <p>¿Cómo calificarías {item.nombreJuego}?</p>
                      <div className="estrellas-container">
                        {renderEstrellas(calificacion, true)}
                        <span className="calificacion-texto">
                          ({calificacion} de 5 estrellas)
                        </span>
                      </div>
                    </div>

                    <form onSubmit={(e) => handleSubmitReview(e, item.game._id)} className="comentario-form">
                      <div className="form-group">
                        <label htmlFor={`comentario-${index}`}>📝 Deja tu review:</label>
                        <textarea 
                          id={`comentario-${index}`}
                          name="comentario" 
                          rows="4"
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          className="form-control"
                          placeholder="Comparte tu experiencia con este juego..."
                          required
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="btn btn--primary"
                          disabled={enviandoReview}
                        >
                          {enviandoReview ? '⏳ Enviando...' : '📤 Enviar Review'}
                        </button>
                      </div>
                    </form>
                  </div>
                </section>
              ) : (
                <section className="calificacion-section">
                  <div className="alert alert-success">
                    <h4>✅ ¡Gracias por tu review!</h4>
                    <p>Ya has calificado este juego. Tu opinión ayuda a otros compradores.</p>
                  </div>
                </section>
              )}

              {/* Reviews existentes de este juego */}
            </div>
          ))}

          {/* Detalles de la compra */}
          <section className="detalles-section">
            <h3>📋 Información de la Compra</h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <span className="detalle-label">📅 Fecha de compra:</span>
                <span className="detalle-valor">{formatearFecha(compra.fecha)}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">💳 Método de pago:</span>
                <span className="detalle-valor">
                  {compra.metodoPago === 'tarjeta' ? 'Tarjeta de crédito/débito' : 'Transferencia bancaria'}
                </span>
              </div>
              <div className="detalle-item total">
                <span className="detalle-label">🎯 Total pagado:</span>
                <span className="detalle-valor">{formatearPrecio(compra.total)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
export default DetalleCompra;