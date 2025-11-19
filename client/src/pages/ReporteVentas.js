import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReporteVentas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ventas, setVentas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    ventasTotales: 0,
    productosVendidos: 0,
    ordenesTotales: 0,
    promedioPorVenta: 0
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerVentasVendedor();
  }, []);

  const obtenerVentasVendedor = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/orders/vendedor/ventas', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setVentas(response.data.ventas);
        setEstadisticas(response.data.estadisticas);
      }
    } catch (error) {
      console.error('Error obteniendo ventas:', error);
      alert('Error al cargar el reporte de ventas');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('/api/orders/vendedor/ventas', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fechaInicio: fechaInicio || undefined,
          fechaFin: fechaFin || undefined
        }
      });

      if (response.data.success) {
        setVentas(response.data.ventas);
        setEstadisticas(response.data.estadisticas);
      }
    } catch (error) {
      console.error('Error aplicando filtros:', error);
      alert('Error al aplicar filtros');
    } finally {
      setCargando(false);
    }
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    return `$${precio.toFixed(2)} MXN`;
  };

  if (cargando) {
    return (
      <section className="section container">
        <div className="cargando">
          <h2>Cargando mis ventas...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="reporte-ventas">
        <div className="section__head">
          <h2>📊 Mis Ventas</h2>
          <p>Consulta el historial de tus ventas y productos vendidos</p>
        </div>

        <div className="reporte-content">
          <form onSubmit={handleSubmit} className="filtros-form">
            <div className="filtros-row">
              <div className="form-group">
                <label htmlFor="fecha_inicio">Fecha inicio:</label>
                <input 
                  type="date" 
                  id="fecha_inicio"
                  name="fecha_inicio" 
                  className="form-control"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              
              <span className="filtro-separador">a</span>
              
              <div className="form-group">
                <label htmlFor="fecha_fin">Fecha fin:</label>
                <input 
                  type="date" 
                  id="fecha_fin"
                  name="fecha_fin" 
                  className="form-control"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              
              <button type="submit" className="btn btn--primary">
                🔍 Aplicar Filtros
              </button>
            </div>
          </form>

          <div className="tabla-container">
            <table className="tabla-ventas">
              <thead>
                <tr>
                  <th>Orden ID</th>
                  <th>Comprador</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                      No tienes ventas registradas en el período seleccionado
                    </td>
                  </tr>
                ) : (
                  ventas.map((venta, index) => (
                    <tr key={`${venta.ordenId}-${index}`}>
                      <td>#{venta.ordenId.slice(-8).toUpperCase()}</td>
                      <td>{venta.comprador}</td>
                      <td>{venta.nombreJuego}</td>
                      <td>{venta.cantidad}</td>
                      <td>{formatearPrecio(venta.precio)}</td>
                      <td>{formatearPrecio(venta.subtotal)}</td>
                      <td>{new Date(venta.fecha).toLocaleDateString('es-ES')}</td>
                    </tr>
                  ))
                )}
                {/* Fila de totales */}
                {ventas.length > 0 && (
                  <tr className="fila-total">
                    <td colSpan="5"><strong>Total de Mis Ventas</strong></td>
                    <td colSpan="2"><strong>{formatearPrecio(estadisticas.ventasTotales)}</strong></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {ventas.length > 0 && (
            <div className="resumen-ventas">
              <h3>📈 Resumen de Mis Ventas</h3>
              <div className="resumen-grid">
                <div className="resumen-card">
                  <div className="resumen-icon">💰</div>
                  <div className="resumen-valor">{formatearPrecio(estadisticas.ventasTotales)}</div>
                  <div className="resumen-label">Ventas Totales</div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">📦</div>
                  <div className="resumen-valor">{estadisticas.productosVendidos}</div>
                  <div className="resumen-label">Productos Vendidos</div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">📋</div>
                  <div className="resumen-valor">{estadisticas.ordenesTotales}</div>
                  <div className="resumen-label">Órdenes Recibidas</div>
                </div>
                <div className="resumen-card">
                  <div className="resumen-icon">📊</div>
                  <div className="resumen-valor">{formatearPrecio(estadisticas.promedioPorVenta)}</div>
                  <div className="resumen-label">Promedio por Venta</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReporteVentas;