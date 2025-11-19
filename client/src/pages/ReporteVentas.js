import React, { useState } from 'react';

const ReporteVentas = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para aplicar filtros
    alert('Filtros aplicados (simulación)');
  };

  return (
    <section className="section container">
      <div className="reporte-ventas">
        <div className="section__head">
          <h2>📊 Reporte de Ventas</h2>
          <p>Consulta y analiza el historial de ventas de la plataforma</p>
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
                  <th>Producto</th>
                  <th>Nombre del producto</th>
                  <th>Compañía</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>🎮</td>
                  <td>Super Mario Odyssey</td>
                  <td>Nintendo</td>
                  <td>5</td>
                  <td>$1,300 MXN</td>
                  <td>$6,500 MXN</td>
                </tr>
                <tr>
                  <td>🎮</td>
                  <td>Halo Infinite</td>
                  <td>Microsoft</td>
                  <td>3</td>
                  <td>$960 MXN</td>
                  <td>$2,880 MXN</td>
                </tr>
                <tr>
                  <td>🎮</td>
                  <td>God of War Ragnarök</td>
                  <td>Sony</td>
                  <td>2</td>
                  <td>$1,499 MXN</td>
                  <td>$2,998 MXN</td>
                </tr>
                <tr>
                  <td>🎮</td>
                  <td>Cyberpunk 2077</td>
                  <td>CD Projekt</td>
                  <td>4</td>
                  <td>$899 MXN</td>
                  <td>$3,596 MXN</td>
                </tr>
                <tr>
                  <td>🎮</td>
                  <td>Animal Crossing</td>
                  <td>Nintendo</td>
                  <td>7</td>
                  <td>$1,350 MXN</td>
                  <td>$9,450 MXN</td>
                </tr>
                {/* Fila de totales */}
                <tr className="fila-total">
                  <td colSpan="5"><strong>Total General</strong></td>
                  <td><strong>$25,424 MXN</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="resumen-ventas">
            <h3>📈 Resumen de Ventas</h3>
            <div className="resumen-grid">
              <div className="resumen-card">
                <div className="resumen-icon">💰</div>
                <div className="resumen-valor">$25,424 MXN</div>
                <div className="resumen-label">Ventas Totales</div>
              </div>
              <div className="resumen-card">
                <div className="resumen-icon">📦</div>
                <div className="resumen-valor">21</div>
                <div className="resumen-label">Productos Vendidos</div>
              </div>
              <div className="resumen-card">
                <div className="resumen-icon">🏢</div>
                <div className="resumen-valor">4</div>
                <div className="resumen-label">Compañías</div>
              </div>
              <div className="resumen-card">
                <div className="resumen-icon">📊</div>
                <div className="resumen-valor">$1,211 MXN</div>
                <div className="resumen-label">Promedio por Venta</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReporteVentas;