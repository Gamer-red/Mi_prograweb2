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
    tipo_usuario: '', // Nuevo campo agregado
    avatar: '' // Avatar seleccionado
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    // Limpiar errores previos
    setError('');
    setUploadInfo(null);
    
    if (!file) {
      return;
    }

    // Validar tipo de archivo (solo imágenes)
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setError('❌ Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
      e.target.value = ''; // Limpiar el input
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`❌ La imagen es demasiado grande (${fileSizeMB}MB). El tamaño máximo permitido es 5MB`);
      e.target.value = ''; // Limpiar el input
      return;
    }

    // Mostrar información del archivo
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setUploadInfo({
      name: file.name,
      size: fileSizeMB,
      type: file.type
    });

    // Leer y mostrar vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setFormData({
        ...formData,
        avatar: imageUrl
      });
      setAvatarPreview(imageUrl);
    };
    reader.onerror = () => {
      setError('❌ Error al leer el archivo. Por favor intenta con otra imagen.');
      e.target.value = ''; // Limpiar el input
    };
    reader.readAsDataURL(file);
  };

  const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
  };

  const validatePassword = (password) => {
  // Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
  return regex.test(password);
  };

  const validatePhone = (telefono) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(telefono);
  };
  

  const handleSubmit = async (e) => {
      e.preventDefault();
    setLoading(true);
    setError("");

    // --- VALIDACIONES FRONT ---

    // Nombre mínimo 3 caracteres
    if (formData.nombre_usuario.trim().length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      setLoading(false);
      return;
    }

    // Validar email
    if (!validateEmail(formData.correo)) {
      setError("El correo electrónico no es válido.");
      setLoading(false);
      return;
    }

    // Contraseña segura
    if (!validatePassword(formData.contrasenia)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, número y un símbolo."
      );
      setLoading(false);
      return;
    }

    // Confirmación de contraseña
    if (formData.contrasenia !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // Validar tipo_usuario
    if (!formData.tipo_usuario) {
      setError("Debes seleccionar un tipo de cuenta (Comprador o Vendedor).");
      setLoading(false);
      return;
    }

    // Validar sexo
    if (!formData.sexo) {
      setError("Selecciona tu sexo.");
      setLoading(false);
      return;
    }

    // Validar teléfono
    if (!validatePhone(formData.telefono)) {
      setError("El número de teléfono debe tener exactamente 10 dígitos.");
      setLoading(false);
      return;
    }

   
    if (!formData.avatar) {
      setError("Debes seleccionar una foto de perfil.");
      setLoading(false);
      return;
    }
    

    // --- ENVÍO AL BACK ---
    const result = await register(formData);

    if (result.success) {
      navigate("/");
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

        {/* Selección de Avatar */}
        <div className="form-group">
          <label>Foto de perfil</label>
          <div className="avatar-selection">
            {/* Vista previa de la imagen subida */}
            <div className="avatar-preview-container">
              <div className="avatar-preview">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Vista previa del avatar" />
                ) : (
                  <div className="avatar-placeholder">👤</div>
                )}
              </div>
              <div className="avatar-preview-info">
                <p className="avatar-preview-label">
                  {avatarPreview ? '✅ Imagen seleccionada' : 'Sube tu foto de perfil'}
                </p>
                {uploadInfo && (
                  <div className="avatar-file-info">
                    <p className="avatar-file-name">📄 {uploadInfo.name}</p>
                    <p className="avatar-file-size">📊 Tamaño: {uploadInfo.size} MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Botón para subir imagen */}
            <div className="avatar-upload">
              <label htmlFor="avatar-upload" className="avatar-upload-button">
                <span>📷 Subir imagen</span>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              
              {/* Mensaje informativo sobre formatos aceptados */}
              <div className="avatar-upload-info">
                <p className="avatar-upload-hint">
                  <strong>Formatos aceptados:</strong> JPG, PNG, GIF, WEBP
                </p>
                <p className="avatar-upload-hint">
                  <strong>Tamaño máximo:</strong> 5MB
                </p>
              </div>
            </div>
          </div>
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