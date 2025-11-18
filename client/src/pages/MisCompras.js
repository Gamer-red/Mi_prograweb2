import React from 'react';
import { Link } from 'react-router-dom';

const MisCompras = () => {
  const compras = [
    { id: 'compra1', producto: 'Super Mario Odyssey', fecha: '15 Nov 2024', total: 1300, estado: 'Entregado' },
    { id: 'compra2', producto: 'Halo Infinite', fecha: '10 Nov 2024', total: 960, estado: 'Entregado' },
    { id: 'compra3', producto: 'God of War Ragnarök', fecha: '5 Nov 2024', total: 1499, estado: 'En camino' }
  ];

  return (
    <section className="section container">
      <div className="mis-compras">
        <div className="section__head">
          <h2>📦 Mis Compras</h2>
          <p>Revisa el historial de tus compras realizadas</p>
        </div>

        <div className="compras-list">
          {compras.map(compra => (
            <div key={compra.id} className="compra-item">
              <div className="compra-info">
                <h3>{compra.producto}</h3>
                <p>📅 {compra.fecha} • 💰 ${compra.total} MXN</p>
                <span className={`estado ${compra.estado.toLowerCase().replace(' ', '-')}`}>
                  {compra.estado}
                </span>
              </div>
              <div className="compra-actions">
                <Link to={`/detalle-compra/${compra.id}`} className="btn btn--primary">
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MisCompras;