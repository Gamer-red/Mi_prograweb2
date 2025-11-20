import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HistorialCompras = () => {
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerCompras();
  }, []);

  const obtenerCompras = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("📦 RESPUESTA COMPLETA DEL HISTORIAL:", response.data);

      if (response.data.success) {
        setCompras(response.data.orders);
      }

    } catch (error) {
      console.error('❌ Error obteniendo compras:', error);
      setError('Error al cargar el historial de compras');
    } finally {
      setCargando(false);
    }
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
          <h2>🛒 Cargando tus compras...</h2>
          <p>Estamos obteniendo tu historial de compras</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section container">
        <div className="error">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={obtenerCompras} className="btn btn--primary">
            🔄 Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="historial-compras">
        <div className="section__head">
          <h2>🛒 Historial de Compras</h2>
          <p>Revisa todas tus compras realizadas</p>
        </div>

        {compras.length === 0 ? (
          <div className="sin-compras">
            <div className="sin-compras__icon">📦</div>
            <h3>No tienes compras realizadas</h3>
            <p>Cuando realices una compra, aparecerá en este historial.</p>
            <Link to="/catalogo" className="btn btn--primary">
              🎮 Ir al Catálogo
            </Link>
          </div>
        ) : (
          <div className="compras-lista">
            {compras.map((compra) => (
              <div key={compra._id} className="compra-card">

                <div className="compra-header">
                  <div className="compra-info">
                    <h3>Orden #{compra._id.slice(-8).toUpperCase()}</h3>
                    <p className="fecha-compra">📅 {formatearFecha(compra.fecha)}</p>
                    <p className="metodo-pago">
                      💳 {compra.metodoPago === 'tarjeta' ? 'Tarjeta de crédito/débito' : 'Transferencia bancaria'}
                    </p>
                  </div>
                  <div className="compra-total">
                    <span className="total-label">Total:</span>
                    <span className="total-precio">{formatearPrecio(compra.total)}</span>
                  </div>
                </div>

                <div className="compra-items">
                  <h4>Productos comprados:</h4>

                  {compra.items.map((item, index) => {
                    
                    // 🟩 LOGS IMPORTANTES
                    console.log("🟦 ITEM COMPLETO:", item);
                    console.log("🟨 GAME:", item.game);
                    console.log("🟧 IMÁGENES:", item.game?.imagenes);

                    return (
                      <div key={index} className="compra-item">

                        <div className="item-imagen">
                          <img
                            src={
                              item.game?.imagenes?.[0]?.filename
                                ? `http://localhost:3000/uploads/${item.game.imagenes[0].filename}`
                                : 'https://via.placeholder.com/300x400/4A5568/FFFFFF?text=Sin+Imagen'
                            }
                            alt={item.nombreJuego}
                            className="imagen-item"
                          />
                        </div>

                        <div className="item-info">
                          <h5>{item.nombreJuego}</h5>
                          <p className="item-detalles">
                            Cantidad: {item.cantidad} × {formatearPrecio(item.precio)}
                          </p>
                          <p className="item-subtotal">
                            Subtotal: {formatearPrecio(item.subtotal)}
                          </p>
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div className="compra-actions">
                  <Link to={`/detalle-compra/${compra._id}`} className="btn btn--outline">
                    📋 Ver Detalle Completo
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HistorialCompras;
