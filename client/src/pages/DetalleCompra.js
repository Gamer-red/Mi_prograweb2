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

  const handleSubmitReview = async (e, gameId) => {
    e.preventDefault();
    
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
      }
    } catch (error) {
      console.error('Error enviando review:', error);
      alert(error.response?.data?.error || 'Error al enviar la review');
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
                  </div>
                </div>
              </section>

              {/* Sección de review para este juego */}
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