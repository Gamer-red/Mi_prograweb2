import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const DetalleCompra = () => {
  const { id } = useParams();
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);

  // Datos de ejemplo de la compra
  const compra = {
    _id: id || 'compra1',
    fecha: '15 de Noviembre, 2024',
    producto: {
      nombre: 'Super Mario Odyssey',
      imagen: 'https://th.bing.com/th/id/R.898f1223c35699754c9b96ea43c0021e?rik=yxWU8PTADy1ZHg&pid=ImgRaw&r=0',
      plataforma: 'Nintendo Switch',
      precio: 1300,
      cantidad: 1,
      total: 1300
    },
    estado: 'Entregado',
    metodoPago: 'Tarjeta de crédito',
    direccion: 'Av. Principal #123, Ciudad de México'
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

 return (
  <section className="section container">
    <div className="detalle-compra">
      <div className="section__head">
        <h2>📦 Detalle de Compra</h2>
        <p>Revisa los detalles de tu compra y deja tu opinión</p>
      </div>

      <div className="compra-content">
        {/* Información del producto comprado - CORREGIDO */}
        <section className="producto-section">
          <div className="producto-header-corregido">
            <div className="producto-imagen-corregido">
              <img 
                src={compra.producto.imagen} 
                alt={compra.producto.nombre}
                className="imagen-producto-corregido"
              />
            </div>
            <div className="producto-info-corregido">
              <p className="fecha-compra">🛒 Comprado el: <strong>{compra.fecha}</strong></p>
              <h3>{compra.producto.nombre}</h3>
              <p className="plataforma">{compra.producto.plataforma}</p>
              <div className="estado-compra">
                <span className={`estado-badge ${compra.estado.toLowerCase()}`}>
                  {compra.estado}
                </span>
              </div>
            </div>
          </div>
        </section>

          {/* Detalles de la compra */}
          <section className="detalles-section">
            <h3>📋 Información de la Compra</h3>
            <div className="detalles-grid">
              <div className="detalle-item">
                <span className="detalle-label">📅 Fecha de compra:</span>
                <span className="detalle-valor">{compra.fecha}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">💰 Precio unitario:</span>
                <span className="detalle-valor">${compra.producto.precio} MXN</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">📦 Cantidad:</span>
                <span className="detalle-valor">{compra.producto.cantidad}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label">💳 Método de pago:</span>
                <span className="detalle-valor">{compra.metodoPago}</span>
              </div>
              <div className="detalle-item total">
                <span className="detalle-label">🎯 Total pagado:</span>
                <span className="detalle-valor">${compra.producto.total} MXN</span>
              </div>
            </div>
          </section>

          {/* Dirección de envío */}
          <section className="envio-section">
            <h3>🚚 Dirección de Envío</h3>
            <div className="direccion-info">
              <p>{compra.direccion}</p>
            </div>
          </section>

          {/* Calificación y comentarios */}
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
              
              <div className="comentario-item">
                <div className="comentario-header">
                  <span className="usuario">María García</span>
                  <div className="estrellas-comentario">
                    {renderEstrellas(4)}
                  </div>
                </div>
                <p className="comentario-texto">
                  Muy buen juego, aunque me gustaría que tuviera más contenido descargable. 
                  Por lo demás, todo perfecto.
                </p>
                <span className="fecha-comentario">Hace 1 semana</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default DetalleCompra;