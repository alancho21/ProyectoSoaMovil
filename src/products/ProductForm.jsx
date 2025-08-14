import { useState, useEffect } from 'react';
import { FaBreadSlice, FaDollarSign, FaBoxes, FaListUl } from 'react-icons/fa';
import { toast } from 'react-toastify';

const initialState = {
  name: '',
  description: '',
  purchase_price: '',
  sale_price: '',
  category: '',
  stock: ''
};

const ProductForm = ({ onSubmit, editingProduct, onCancel }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: '', label: 'Seleccione una categoría...' },
    { value: 'blanco', label: 'Blanco' },
    { value: 'integral', label: 'Integral' },
    { value: 'dulce', label: 'Dulce' },
    { value: 'artesanal', label: 'Artesanal' },
    { value: 'sin_gluten', label: 'Sin Gluten' },
    { value: 'regional', label: 'Regional' },
    { value: 'enriquecido', label: 'Enriquecido' },
    { value: 'de_molde', label: 'De Molde' },
    { value: 'crujiente', label: 'Crujiente' },
    { value: 'dulce_relleno', label: 'Dulce Relleno' },
    { value: 'salado', label: 'Salado' },
    { value: 'festivo', label: 'Festivo' },
    { value: 'vegano', label: 'Vegano' }
  ];

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        purchase_price: editingProduct.purchase_price?.toString() || '',
        sale_price: editingProduct.sale_price?.toString() || '',
        category: editingProduct.category || '',
        stock: editingProduct.stock?.toString() || ''
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones requeridas
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.purchase_price) {
      newErrors.purchase_price = 'El precio de compra es requerido';
    } else if (parseFloat(formData.purchase_price) < 0) {
      newErrors.purchase_price = 'El precio de compra no puede ser negativo';
    }

    if (!formData.sale_price) {
      newErrors.sale_price = 'El precio de venta es requerido';
    } else if (parseFloat(formData.sale_price) < 0) {
      newErrors.sale_price = 'El precio de venta no puede ser negativo';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    if (!formData.stock) {
      newErrors.stock = 'El stock es requerido';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    // Validación de descripción
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    // Validación de precios: venta >= compra
    const purchasePrice = parseFloat(formData.purchase_price);
    const salePrice = parseFloat(formData.sale_price);
    
    if (purchasePrice && salePrice && salePrice < purchasePrice) {
      newErrors.sale_price = 'El precio de venta debe ser mayor o igual al precio de compra';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        purchase_price: parseFloat(formData.purchase_price),
        sale_price: parseFloat(formData.sale_price),
        category: formData.category,
        stock: parseInt(formData.stock)
      };

      await onSubmit(payload);
      
      // Limpiar formulario solo si no estamos editando
      if (!editingProduct) {
        setFormData(initialState);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Error al procesar el formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateMargin = () => {
    const purchase = parseFloat(formData.purchase_price);
    const sale = parseFloat(formData.sale_price);
    if (purchase && sale && purchase > 0) {
      return ((sale - purchase) / purchase * 100).toFixed(1);
    }
    return '0';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaBreadSlice className="text-orange-500 mr-2" />
            Nombre <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2.5 border rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-cream-200'
            }`}
            placeholder="Ingresa el nombre del producto"
            maxLength="100"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Categoría */}
        <div className="form-group">
          <label htmlFor="category" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            Categoría <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-2.5 border rounded-md bg-cream-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
              errors.category ? 'border-red-300 bg-red-50' : 'border-cream-200'
            }`}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Precio de Compra */}
        <div className="form-group">
          <label htmlFor="purchase_price" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaDollarSign className="text-orange-500 mr-2" />
            Precio de Compra <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="purchase_price"
            type="number"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full p-2.5 border rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
              errors.purchase_price ? 'border-red-300 bg-red-50' : 'border-cream-200'
            }`}
            placeholder="0.00"
          />
          {errors.purchase_price && <p className="text-red-500 text-xs mt-1">{errors.purchase_price}</p>}
        </div>

        {/* Precio de Venta */}
        <div className="form-group">
          <label htmlFor="sale_price" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaDollarSign className="text-green-500 mr-2" />
            Precio de Venta <span className="text-red-500 ml-1">*</span>
            {formData.purchase_price && formData.sale_price && (
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Margen: {calculateMargin()}%
              </span>
            )}
          </label>
          <input
            id="sale_price"
            type="number"
            name="sale_price"
            value={formData.sale_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full p-2.5 border rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
              errors.sale_price ? 'border-red-300 bg-red-50' : 'border-cream-200'
            }`}
            placeholder="0.00"
          />
          {errors.sale_price && <p className="text-red-500 text-xs mt-1">{errors.sale_price}</p>}
        </div>

        {/* Stock */}
        <div className="form-group">
          <label htmlFor="stock" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaBoxes className="text-orange-500 mr-2" />
            Stock <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={`w-full p-2.5 border rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
              errors.stock ? 'border-red-300 bg-red-50' : 'border-cream-200'
            }`}
            placeholder="0"
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
        </div>
      </div>

      {/* Descripción */}
      <div className="form-group">
        <label htmlFor="description" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
          <FaListUl className="text-orange-500 mr-2" />
          Descripción
          {formData.description && (
            <span className="ml-auto text-xs text-gray-500">
              {formData.description.length}/1000
            </span>
          )}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full p-2.5 border rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${
            errors.description ? 'border-red-300 bg-red-50' : 'border-cream-200'
          }`}
          rows="4"
          placeholder="Descripción opcional del producto..."
          maxLength="1000"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Resumen de cálculos */}
      {(formData.purchase_price || formData.sale_price || formData.stock) && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Resumen</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Margen de ganancia:</span>
              <span className="ml-2 font-medium text-green-600">{calculateMargin()}%</span>
            </div>
            <div>
              <span className="text-gray-600">Ganancia por unidad:</span>
              <span className="ml-2 font-medium text-green-600">
                ${((parseFloat(formData.sale_price) || 0) - (parseFloat(formData.purchase_price) || 0)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Valor total inventario:</span>
              <span className="ml-2 font-medium text-blue-600">
                ${((parseFloat(formData.sale_price) || 0) * (parseInt(formData.stock) || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
            disabled={isSubmitting}
          >
            ❌ Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium flex items-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Procesando...
            </>
          ) : (
            <>
              {editingProduct ? '✏️ Actualizar Producto' : '➕ Crear Producto'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;