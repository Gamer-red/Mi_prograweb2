import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NuevoProducto = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  const [companias, setCompanias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plataformasResponse, categoriasResponse, companiasResponse] = await Promise.all([
          axios.get('/api/platforms'),
          axios.get('/api/categories'),
          axios.get('/api/companies')
        ]);

        setPlataformas(plataformasResponse.data.platforms || []);
        setCategorias(categoriasResponse.data.categories || []);
        setCompanias(companiasResponse.data.companies || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Obtener el token de autenticación
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log('🔍 CurrentUser del localStorage:', currentUser);

      if (!currentUser) {
        alert('Debes iniciar sesión para crear un producto');
        setSubmitting(false);
        return;
      }

      // OBTENER EL TOKEN - Esta es la parte clave que falta
      const token = localStorage.getItem('token') || currentUser.token;
      console.log('🔑 Token obtenido:', token ? '✅ Sí' : '❌ No');

      if (!token) {
        alert('Error de autenticación. Vuelve a iniciar sesión.');
        setSubmitting(false);
        return;
      }

      // Mostrar datos que se enviarán
      console.log('📝 Datos del formulario:');
      console.log('   - Usuario ID:', currentUser.id || currentUser._id);
      console.log('   - Token:', token ? 'Presente' : 'Faltante');

      // Crear FormData
      const formData = new FormData();
      formData.append('nombre', e.target.nombre.value);
      formData.append('cantidad', e.target.cantidad.value);
      formData.append('precio', e.target.precio.value);
      formData.append('informacion', e.target.informacion.value);
      formData.append('plataforma', e.target.plataforma.value);
      formData.append('categoria', e.target.categoria.value);
      
      if (e.target.compania.value) {
        formData.append('compania', e.target.compania.value);
      }

      // Agregar imágenes
      selectedImages.forEach((image) => {
        formData.append('imagenes', image);
      });

      console.log('📤 Enviando formulario CON token...');
      
      // ENVIAR CON TOKEN - Esta es la corrección principal
      const response = await axios.post('/api/games', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // ✅ AGREGAR ESTA LÍNEA
        }
      });

      if (response.data.success) {
        alert('✅ Producto creado exitosamente!');
        console.log('Juego creado:', response.data.game);
        
        // Limpiar formulario
        e.target.reset();
        setSelectedImages([]);
      }
      
    } catch (error) {
      console.error('❌ Error al crear producto:', error);
      alert(`❌ Error: ${error.response?.data?.error || 'No se pudo crear el producto'}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="section container">
        <div className="loading">Cargando datos...</div>
      </section>
    );
  }

  return (
    <section className="section container">
      <div className="nuevo-producto">
        <div className="section__head">
          <h2>➕ Nuevo Producto</h2>
          <p>Agrega un nuevo videojuego al catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="producto-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del juego</label>
            <input 
              type="text" 
              id="nombre"
              name="nombre" 
              className="form-control"
              placeholder="Ej: Super Mario Odyssey"
              required
            />
          </div>

          <div className="fila">
            <div className="form-group">
              <label htmlFor="cantidad">Cantidad</label>
              <input 
                type="number" 
                id="cantidad"
                name="cantidad" 
                className="form-control"
                min="1"
                placeholder="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="precio">Precio</label>
              <input 
                type="number" 
                id="precio"
                name="precio" 
                step="0.01" 
                className="form-control"
                min="0"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="informacion">Información del juego</label>
            <textarea 
              id="informacion"
              name="informacion" 
              className="form-control"
              rows="4"
              placeholder="Descripción del juego..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plataforma">Plataforma</label>
            <select id="plataforma" name="plataforma" className="form-select" required>
              <option value="">Selecciona una plataforma</option>
              {plataformas.map(plataforma => (
                <option key={plataforma._id} value={plataforma._id}>
                  {plataforma.Nombre_Plataforma}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <select id="categoria" name="categoria" className="form-select" required>
              <option value="">Selecciona una categoría</option>
              {categorias.map(categoria => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="compania">Desarrollador</label>
            <select id="compania" name="compania" className="form-select">
              <option value="">Selecciona un desarrollador (opcional)</option>
              {companias.map(compania => (
                <option key={compania._id} value={compania._id}>
                  {compania.Nombre_Compania}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imagenes">Imágenes del juego</label>
            <input 
              type="file" 
              id="imagenes"
              name="imagenes" 
              multiple 
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              required
            />
            <small className="form-help">
              Selecciona una o más imágenes. La primera será la imagen principal.
              {selectedImages.length > 0 && (
                <span className="selected-count">
                  ✅ {selectedImages.length} imagen(es) seleccionada(s)
                </span>
              )}
            </small>
            
            {/* Vista previa de imágenes seleccionadas */}
            {selectedImages.length > 0 && (
              <div className="image-preview">
                <h4>Vista previa:</h4>
                <div className="preview-grid">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="preview-item">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Vista previa ${index + 1}`}
                        className="preview-image"
                      />
                      <span className="preview-label">
                        {index === 0 ? 'Principal' : `Galería ${index}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? '⏳ Creando...' : '🎮 Crear Producto'}
            </button>
            <button type="button" className="btn btn--ghost">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NuevoProducto;