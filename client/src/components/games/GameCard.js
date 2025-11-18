// components/games/GameCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const GameCard = ({ game }) => {
  const cart = useCart(); // ✅ Llamar una sola vez
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ DEBUG CORREGIDO - usar la variable 'cart'
  console.log('🔍 CartContext en GameCard:', cart);
  console.log('🔍 addToCart existe:', !!cart.addToCart);

  const handleCardClick = () => {
    navigate(`/producto/${game._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    console.log('🛒 Intentando agregar al carrito:', game._id);
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      // ✅ Usar cart.addToCart en lugar de addToCart directo
      const result = await cart.addToCart(game._id, 1);
      if (result.success) {
        alert(`${game.nombre_juego} agregado al carrito`);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar a lista de deseos');
      return;
    }
    alert(`${game.nombre_juego} agregado a lista de deseos`);
  };

  return (
    <div className="card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card__image-container">
        <img src={game.image} alt={game.nombre_juego} />
      </div>
      
      <div className="card__body">
        <div className="card__platform">{game.platform}</div>
        <h3 className="card__title">{game.nombre_juego}</h3>

        <div className="card__price">
          <div>
            <div className="price">${game.precio} MXN</div>
          </div>
        </div>

        <div className="card__actions">
          <button 
            className="btn btn--primary" 
            style={{ flex: 1 }}
            onClick={handleAddToCart}
          >
            🛒 Agregar
          </button>
          <button 
            className="btn btn--ghost"
            onClick={handleAddToWishlist}
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;