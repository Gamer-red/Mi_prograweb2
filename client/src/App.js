import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  AuthProvider  from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { GameProvider } from './context/GameContext';
import Header from './components/common/Header';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import NuevoProducto from './pages/NuevoProducto';
import ReporteVentas from './pages/ReporteVentas';
import ProductoPage from './pages/ProductoPage';
import DetalleCompra from './pages/DetalleCompra'; 
import HistorialCompras from './pages/HistorialCompras';

import './App.css';
function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <CartProvider>
            <div className="App">
              <Header />
              <main>
                <Routes>
                   <Route path="/" element={<Home />} />
  <Route path="/catalog" element={<Catalog />} />
  <Route path="/producto/:id" element={<ProductoPage />} />
  <Route path="/historial-compras" element={<HistorialCompras />} />
  <Route path="/detalle-compra/:id" element={<DetalleCompra />} />
  <Route path="/nuevo-producto" element={<NuevoProducto />} />
  <Route path="/reporte-ventas" element={<ReporteVentas />} />
  <Route path="/cart" element={<CartPage />} />
  <Route path="/profile" element={<ProfilePage />} />
  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>
            </div>
          </CartProvider>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;