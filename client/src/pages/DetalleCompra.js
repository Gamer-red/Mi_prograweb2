import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DetalleCompra = () => {
  const { id } = useParams();

  // Ahora cada producto tiene su propio estado de comentario/calificación
  const [comentarios, setComentarios] = useState({});
  const [calificaciones, setCalificaciones] = useState({});
  const [compra, setCompra] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [gameReviews, setGameReviews] = useState({});
  const [userReviews, setUserReviews] = useState({});
  const [enviandoReview, setEnviandoReview] = useState({});

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

          // Inicializar estados por producto
          const comentariosIniciales = {};
          const califIniciales = {};
          const enviandoInicial = {};

          compraEncontrada.items.forEach(item => {
            comentariosIniciales[item.game._id] = "";
            califIniciales[item.game._id] = 5;
            enviandoInicial[item.game._id] = false;
          });

          setComentarios(comentariosIniciales);
          setCalificaciones(califIniciales);
          setEnviandoReview(enviandoInicial);

          // Cargar reviews por juego
          await obtenerReviewsDeJuegos(compraEncontrada.items);
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
      } catch {
        reviewsMap[item.game._id] = { reviews: [], averageRating: 0, totalReviews: 0 };
      }
    }

    setGameReviews(reviewsMap);
  };

  const obtenerReviewsDelUsuario = async (items) => {
    const token = localStorage.getItem('token');
    const userReviewsMap = {};

    for (const item of items) {
      try {
        const response = await axios.get(`/api/reviews/user-game/${item.game._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userReviewsMap[item.game._id] = response.data.review || null;
      } catch {
        userReviewsMap[item.game._id] = null;
      }
    }

    setUserReviews(userReviewsMap);
  };

  const usuarioYaReviewo = (gameId) => {
    return userReviews[gameId] !== null && userReviews[gameId] !== undefined;
  };

  const handleCalificacionClick = (gameId, estrellas) => {
    setCalificaciones(prev => ({
      ...prev,
      [gameId]: estrellas
    }));
  };

  const handleSubmitReview = async (e, gameId) => {
    e.preventDefault();

    if (usuarioYaReviewo(gameId)) {
      alert("❌ Ya calificaste este juego.");
      return;
    }

    if (!comentarios[gameId].trim()) {
      alert("Por favor escribe un comentario");
      return;
    }

    try {
      setEnviandoReview(prev => ({ ...prev, [gameId]: true }));
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/reviews",
        {
          gameId,
          orderId: compra._id,
          calificacion: calificaciones[gameId],
          comentario: comentarios[gameId]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        alert("✅ Review enviada!");

        // Reiniciar solo este producto
        setComentarios(prev => ({ ...prev, [gameId]: "" }));
        setCalificaciones(prev => ({ ...prev, [gameId]: 5 }));

        await obtenerReviewsDeJuegos(compra.items);
        await obtenerReviewsDelUsuario(compra.items);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error al enviar la review");
    } finally {
      setEnviandoReview(prev => ({ ...prev, [gameId]: false }));
    }
  };

  const renderEstrellas = (numeroEstrellas, interactivo, gameId) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={`estrella ${i <= numeroEstrellas ? "activa" : ""} ${interactivo ? "interactiva" : ""}`}
          onClick={interactivo ? () => handleCalificacionClick(gameId, i) : undefined}
        >
          {i <= numeroEstrellas ? "★" : "☆"}
        </span>
      );
    }
    return estrellas;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatearPrecio = (precio) => `$${precio.toFixed(2)} MXN`;

  const getAverageRating = (gameId) => gameReviews[gameId]?.averageRating || 0;
  const getTotalReviews = (gameId) => gameReviews[gameId]?.totalReviews || 0;

  if (cargando) return <h2>Cargando...</h2>;

  if (error || !compra) {
    return (
      <section className="section container">
        <h2>❌ Error</h2>
        <p>{error || "No se pudo cargar la compra"}</p>
        <Link to="/historial-compras" className="btn btn--primary">
          Volver
        </Link>
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

          {compra.items.map((item, index) => (
            <div key={index}>
              <section className="producto-section">
                <div className="producto-header-corregido">

                  <div className="producto-imagen-corregido">
                    <img
                      src={
                        item.game?.imagenes?.[0]?.filename
                          ? `http://localhost:3000/uploads/${item.game.imagenes[0].filename}`
                          : "https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Sin+Imagen"
                      }
                      alt={item.nombreJuego}
                      className="imagen-item"
                    />
                  </div>

                  <div className="producto-info-corregido">
                    <p className="fecha-compra">
                      🛒 Comprado el: <strong>{formatearFecha(compra.fecha)}</strong>
                    </p>
                    <h3>{item.nombreJuego}</h3>
                    <p className="plataforma">Cantidad: {item.cantidad}</p>

                    {/* Rating promedio */}
                    <div className="rating-promedio">
                      <div className="estrellas-promedio">
                        {renderEstrellas(Math.round(getAverageRating(item.game._id)), false)}
                      </div>
                      <span>
                        ({getAverageRating(item.game._id).toFixed(1)} de 5 - {getTotalReviews(item.game._id)} reviews)
                      </span>
                    </div>

                    {/* Review existente del usuario */}
                    {usuarioYaReviewo(item.game._id) && (
                      <div className="alert alert-info">
                        <strong>Ya calificaste este juego</strong>
                        <div>
                          {renderEstrellas(userReviews[item.game._id].calificacion, false)}
                        </div>
                        <p>"{userReviews[item.game._id].comentario}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Formulario de review por producto */}
              {!usuarioYaReviewo(item.game._id) && (
                <section className="calificacion-section">
                  <h3>⭐ Califica este Juego</h3>

                  <div className="estrellas-container">
                    {renderEstrellas(calificaciones[item.game._id], true, item.game._id)}
                    <span>({calificaciones[item.game._id]} de 5)</span>
                  </div>

                  <form onSubmit={(e) => handleSubmitReview(e, item.game._id)}>
                    <textarea
                      rows="4"
                      value={comentarios[item.game._id]}
                      onChange={(e) =>
                        setComentarios(prev => ({
                          ...prev,
                          [item.game._id]: e.target.value
                        }))
                      }
                      placeholder="Comparte tu experiencia..."
                      required
                    />

                    <button className="btn btn--primary" disabled={enviandoReview[item.game._id]}>
                      {enviandoReview[item.game._id] ? "Enviando..." : "Enviar Review"}
                    </button>
                  </form>
                </section>
              )}
            </div>
          ))}

          {/* ⬇️ SECCIÓN RESTAURADA */}
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
                  {compra.metodoPago === "tarjeta"
                    ? "Tarjeta de crédito/débito"
                    : "Transferencia bancaria"}
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
