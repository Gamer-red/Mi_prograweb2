import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>Iniciar Sesión</h2>
        <p>Ingresa a tu cuenta para continuar</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="tu@email.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Tu contraseña"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <div className="form-switch">
            ¿No tienes cuenta?{' '}
            <button type="button" onClick={onSwitchToRegister} className="link-button">
              Regístrate
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;