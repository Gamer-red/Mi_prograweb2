import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetalleCompra = () => {
  const { id } = useParams();
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [compra, setCompra] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerDetalleCompra();
  }, [id]);

  const obtenerDetalleCompra = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      // Obtener todas las órdenes y filtrar por ID
      const response = await axios.get('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const compraEncontrada = response.data.orders.find(
          order => order._id === id
        );
        
        if (compraEncontrada) {
          setCompra(compraEncontrada);
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

  const handleSubmitComentario = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el comentario
    alert('Comentario enviado (simulación)');
    setComentario('');
  };

  const handleCalificacionClick = (estrellas) => {
    setCalificacion(estrellas);
  };

  const renderEstrellas = (numeroEstrellas, interactivo = false) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <span
          key={i}
          className={`estrella ${i <= numeroEstrellas ? 'activa' : ''} ${interactivo ? 'interactiva' : ''}`}
          onClick={interactivo ? () => handleCalificacionClick(i) : undefined}
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
            <section key={index} className="producto-section">
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
                </div>
              </div>
            </section>
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

          {/* Resto del código permanece igual */}
          <section className="calificacion-section">
            <h3>⭐ Califica tu Compra</h3>
            <div className="calificacion-content">
              <div className="estrellas-calificacion">
                <p>¿Cómo calificarías este producto?</p>
                <div className="estrellas-container">
                  {renderEstrellas(calificacion, true)}
                  <span className="calificacion-texto">
                    ({calificacion} de 5 estrellas)
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitComentario} className="comentario-form">
                <div className="form-group">
                  <label htmlFor="comentario">📝 Deja un comentario:</label>
                  <textarea 
                    id="comentario"
                    name="comentario" 
                    rows="4"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="form-control"
                    placeholder="Comparte tu experiencia con este producto..."
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn--primary">
                    📤 Enviar Comentario
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Comentarios existentes (ejemplo) */}
          <section className="comentarios-section">
            <h3>💬 Comentarios de la Comunidad</h3>
            <div className="comentarios-list">
              <div className="comentario-item">
                <div className="comentario-header">
                  <span className="usuario">Juan Pérez</span>
                  <div className="estrellas-comentario">
                    {renderEstrellas(5)}
                  </div>
                </div>
                <p className="comentario-texto">
                  ¡Excelente juego! Los gráficos son increíbles y la jugabilidad es muy fluida. 
                  Definitivamente recomiendo este título.
                </p>
                <span className="fecha-comentario">Hace 2 días</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default DetalleCompra;