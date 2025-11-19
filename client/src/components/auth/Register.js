import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo: '',
    contrasenia: '',
    confirmPassword: '',
    sexo: '',
    telefono: '',
    tipo_usuario: '' // Nuevo campo agregado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
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

    if (formData.contrasenia !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
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
        <h2>Crear Cuenta</h2>
        <p>Únete a la comunidad gamer más grande de México</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="nombre_usuario">Nombre de usuario</label>
          <input
            type="text"
            id="nombre_usuario"
            name="nombre_usuario"
            value={formData.nombre_usuario}
            onChange={handleChange}
            className="form-control"
            placeholder="Tu nombre de usuario"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="form-control"
            placeholder="tu@email.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="contrasenia">Contraseña</label>
          <input
            type="password"
            id="contrasenia"
            name="contrasenia"
            value={formData.contrasenia}
            onChange={handleChange}
            className="form-control"
            placeholder="Crea una contraseña segura"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-control"
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        {/* Nuevo campo: Tipo de usuario */}
        <div className="form-group">
          <label htmlFor="tipo_usuario">Tipo de cuenta</label>
          
          {/* ✅ AGREGAR ESTA CLASE: "tipo-usuario-options" */}
          <div className="tipo-usuario-options">
            
            <label className="tipo-usuario-option">
              <input
                type="radio"
                name="tipo_usuario"
                value="Comprador"
                checked={formData.tipo_usuario === 'Comprador'}
                onChange={handleChange}
              />
              <div className="option-card">
                <div className="option-icon">🛒</div>
                <div className="option-content">
                  <div className="option-title">Comprador</div>
                  <div className="option-description">
                    Compra juegos y accede a toda la comunidad
                  </div>
                </div>
              </div>
            </label>
            
            <label className="tipo-usuario-option">
              <input
                type="radio"
                name="tipo_usuario"
                value="vendedor"
                checked={formData.tipo_usuario === 'vendedor'}
                onChange={handleChange}
              />
              <div className="option-card">
                <div className="option-icon">🏪</div>
                <div className="option-content">
                  <div className="option-title">Vendedor</div>
                  <div className="option-description">
                    Publica y vende tus videojuegos en la plataforma
                  </div>
                </div>
              </div>
            </label>
            
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="sexo">Sexo</label>
          <select
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Selecciona tu sexo</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
            placeholder="Tu número de teléfono"
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
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          <div className="form-switch">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Inicia sesión
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;