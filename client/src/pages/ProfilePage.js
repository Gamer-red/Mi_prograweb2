import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { currentUser, isAuthenticated, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);

  // Datos de ejemplo para usuario no logueado
  const guestUser = {
    Nombre_usuario: 'Invitado',
    Correo: 'invitado@ejemplo.com',
    Telefono: 'No especificado',
    Sexo: 'No especificado',
    Rol: 'Invitado',
    Avatar: null
  };

  const user = isAuthenticated ? currentUser : guestUser;

  // Estado para el formulario
  const [formData, setFormData] = useState({
    Nombre_usuario: '',
    Correo: '',
    Telefono: '',
    Sexo: '',
    password: '',
    confirmPassword: '',
    Avatar: ''
  });

  // Cargar datos del usuario cuando cambie
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setFormData({
        Nombre_usuario: currentUser.Nombre_usuario || '',
        Correo: currentUser.Correo || '',
        Telefono: currentUser.Telefono || '',
        Sexo: currentUser.Sexo || '',
        password: '',
        confirmPassword: '',
        Avatar: currentUser.Avatar || ''
      });
      
      // Establecer la vista previa del avatar si existe
      if (currentUser.Avatar) {
        setAvatarPreview(currentUser.Avatar);
      }
    }
  }, [currentUser, isAuthenticated]);

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleRegisterRedirect = () => {
    navigate('/auth');
  };

  // Función para manejar la subida de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    // Limpiar errores previos
    setMessage('');
    setUploadInfo(null);
    
    if (!file) {
      return;
    }

    // Validar tipo de archivo (solo imágenes)
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      setMessage('❌ Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
      e.target.value = ''; // Limpiar el input
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setMessage(`❌ La imagen es demasiado grande (${fileSizeMB}MB). El tamaño máximo permitido es 5MB`);
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
      setFormData(prev => ({
        ...prev,
        Avatar: imageUrl
      }));
      setAvatarPreview(imageUrl);
      setMessage('✅ Imagen cargada correctamente. Haz clic en "Guardar Cambios" para actualizar.');
    };
    reader.onerror = () => {
      setMessage('❌ Error al leer el archivo. Por favor intenta con otra imagen.');
      e.target.value = ''; // Limpiar el input
    };
    reader.readAsDataURL(file);
  };

  // FUNCIÓN ACTUALIZADA: Guardar cambios (incluyendo avatar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para editar tu perfil');
      return;
    }

    // Validaciones
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setMessage('❌ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Preparar datos para enviar (sin campos vacíos)
      const updateData = {
        Nombre_usuario: formData.Nombre_usuario,
        Correo: formData.Correo,
        Telefono: formData.Telefono,
        Sexo: formData.Sexo
      };

      // Solo incluir contraseña si se proporcionó
      if (formData.password) {
        updateData.Contrasenia = formData.password;
      }

      // Incluir avatar si hay uno nuevo
      if (formData.Avatar && formData.Avatar !== currentUser.Avatar) {
        updateData.Avatar = formData.Avatar;
      }

      console.log('Enviando datos de actualización:', {
        ...updateData,
        Avatar: updateData.Avatar ? `Base64 (${updateData.Avatar.length} caracteres)` : 'Sin cambios'
      });

      // Llamar a la API para actualizar
      const response = await axios.put(`/api/users/${currentUser.id || currentUser._id}`, updateData);
      
      if (response.data.success) {
        setMessage('✅ Perfil actualizado exitosamente');
        
        // Actualizar el contexto de autenticación
        updateCurrentUser(response.data.user);
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage(`❌ Error: ${error.response?.data?.error || 'No se pudo actualizar el perfil'}`);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Restablecer formulario
  const handleDiscard = () => {
    if (isAuthenticated && currentUser) {
      setFormData({
        Nombre_usuario: currentUser.Nombre_usuario || '',
        Correo: currentUser.Correo || '',
        Telefono: currentUser.Telefono || '',
        Sexo: currentUser.Sexo || '',
        password: '',
        confirmPassword: '',
        Avatar: currentUser.Avatar || ''
      });
      setAvatarPreview(currentUser.Avatar || null);
    }
    setMessage('');
    setUploadInfo(null);
  };

  return (
    <section className="section container">
      <div className="profile-section">
        <div className="section__head">
          <h2>👤 Perfil de Usuario</h2>
          <p>
            {isAuthenticated 
              ? 'Gestiona tu información personal y preferencias' 
              : 'Inicia sesión para acceder a todas las funciones de tu perfil'
            }
          </p>
        </div>

        {!isAuthenticated && (
          <div className="guest-banner">
            <div className="guest-message">
              <h3>🔒 No has iniciado sesión</h3>
              <p>Inicia sesión o regístrate para acceder a todas las funciones de tu perfil</p>
              <div className="guest-actions">
                <button onClick={handleLoginRedirect} className="btn btn--primary">
                  🚀 Iniciar Sesión
                </button>
                <button onClick={handleRegisterRedirect} className="btn btn--ghost">
                  📝 Registrarse
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            👤 Información Personal
          </button>
        </div>

        {/* Contenido de las tabs */}
        <div className="profile-content">
          {activeTab === 'perfil' && (
            <div className="tab-content active">
              <div className="profile-header">
                <div className="profile-avatar">
                  {/* Avatar del usuario */}
                  <div className="avatar-container">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar del usuario" 
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        👤
                      </div>
                    )}
                    
                    {/* Botón para cambiar imagen (solo para usuarios autenticados) */}
                    {isAuthenticated && (
                      <div className="avatar-actions">
                        <label htmlFor="avatar-upload-profile" className="avatar-upload-btn">
                          📷 Cambiar
                          <input
                            type="file"
                            id="avatar-upload-profile"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                        </label>                    
                      </div>
                    )}
                  </div>
                  
                  {!isAuthenticated ? (
                    <div className="guest-badge">Invitado</div>
                  ) : (
                    <div className={`role-badge ${user.Rol === 'vendedor' ? 'role-vendedor' : 'role-cliente'}`}>
                      {user.Rol === 'vendedor' ? '🏪 Vendedor' : '🛒 Cliente'}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h3>{user.Nombre_usuario}</h3>
                  <p>📧 {user.Correo}</p>
                  <p>📞 {user.Telefono}</p>
                  <p>⚧️ {user.Sexo}</p>
                  <p>🎯 Rol: {user.Rol}</p>
                  {isAuthenticated && (
                    <p>🆔 ID: {user.id || user._id}</p>
                  )}
                </div>
              </div>

              {/* Información de archivo subido */}
              {uploadInfo && (
                <div className="upload-info">
                  <p><strong>📄 Archivo:</strong> {uploadInfo.name}</p>
                  <p><strong>📊 Tamaño:</strong> {uploadInfo.size} MB</p>
                </div>
              )}

              <div className="profile-form-container">
                <h3>Información Personal</h3>
                
                {/* Mensaje de estado */}
                {message && (
                  <div className={`message ${message.includes('✅') ? 'message-success' : 'message-error'}`}>
                    {message}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="Nombre_usuario">Nombre de usuario:</label>
                      <input 
                        type="text" 
                        id="Nombre_usuario"
                        name="Nombre_usuario" 
                        className="form-control"
                        placeholder="Tu nombre de usuario"
                        value={formData.Nombre_usuario}
                        onChange={handleInputChange}
                        disabled={!isAuthenticated}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="rol">Rol:</label>
                      <input 
                        type="text" 
                        id="rol"
                        name="rol" 
                        className="form-control"
                        value={user.Rol}
                        disabled
                      />
                      <small className="form-help">El rol no se puede cambiar</small>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="Correo">Correo electrónico:</label>
                    <input 
                      type="email" 
                      id="Correo"
                      name="Correo" 
                      className="form-control"
                      placeholder="tu@email.com"
                      value={formData.Correo}
                      onChange={handleInputChange}
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Telefono">Teléfono:</label>
                    <input 
                      type="tel" 
                      id="Telefono"
                      name="Telefono" 
                      className="form-control"
                      placeholder="+52 123 456 7890"
                      value={formData.Telefono}
                      onChange={handleInputChange}
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Sexo">Sexo:</label>
                    <select 
                      id="Sexo" 
                      name="Sexo" 
                      className="form-select" 
                      value={formData.Sexo}
                      onChange={handleInputChange}
                      disabled={!isAuthenticated}
                    >
                      <option value="">Selecciona tu sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                    </select>
                  </div>

                  {isAuthenticated && (
                    <>
                      <div className="form-group">
                        <label htmlFor="password">Nueva Contraseña:</label>
                        <input 
                          type="password" 
                          id="password"
                          name="password" 
                          className="form-control"
                          placeholder="Deja en blanco para no cambiar"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                        <small className="form-help">Mínimo 6 caracteres</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
                        <input 
                          type="password" 
                          id="confirmPassword"
                          name="confirmPassword" 
                          className="form-control"
                          placeholder="Repite la nueva contraseña"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn--primary"
                      disabled={!isAuthenticated || loading}
                    >
                      {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                    {isAuthenticated && (
                      <button 
                        type="button" 
                        className="btn btn--ghost"
                        onClick={handleDiscard}
                        disabled={loading}
                      >
                        ↩️ Descartar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;