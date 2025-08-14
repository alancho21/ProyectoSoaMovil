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

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        purchase_price: editingProduct.purchase_price?.toString() || '',
        sale_price: editingProduct.sale_price?.toString() || '',
        stock: editingProduct.stock?.toString() || '',
        category: editingProduct.category || ''
      });
    } else {
      setFormData(initialState);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.purchase_price || !formData.sale_price || !formData.stock) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const purchasePrice = parseFloat(formData.purchase_price);
    const salePrice = parseFloat(formData.sale_price);

    if (salePrice <= purchasePrice) {
      toast.error('El precio de venta debe ser mayor al precio de compra');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      purchase_price: purchasePrice,
      sale_price: salePrice,
      category: formData.category,
      stock: parseInt(formData.stock)
    };

    try {
      onSubmit(payload);
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Error al enviar el formulario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaBreadSlice className="text-orange-500 mr-2" />
            Nombre
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2.5 border border-cream-200 rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            placeholder="Ingresa el nombre del producto"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2.5 border border-cream-200 rounded-md bg-cream-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="">Seleccione...</option>
            <option value="blanco">Blanco</option>
            <option value="integral">Integral</option>
            <option value="dulce">Dulce</option>
            <option value="artesanal">Artesanal</option>
            <option value="sin_gluten">Sin gluten</option>
            <option value="regional">Regional</option>
            <option value="enriquecido">Enriquecido</option>
            <option value="de_molde">De molde</option>
            <option value="crujiente">Crujiente</option>
            <option value="dulce_relleno">Dulce relleno</option>
            <option value="salado">Salado</option>
            <option value="festivo">Festivo</option>
            <option value="vegano">Vegano</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="purchase_price" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaDollarSign className="text-orange-500 mr-2" />
            Precio de Compra
          </label>
          <input
            id="purchase_price"
            type="number"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-2.5 border border-cream-200 rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            placeholder="Ingresa el precio de compra"
          />
        </div>

        <div className="form-group">
          <label htmlFor="sale_price" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaDollarSign className="text-green-500 mr-2" />
            Precio de Venta
          </label>
          <input
            id="sale_price"
            type="number"
            name="sale_price"
            value={formData.sale_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-2.5 border border-cream-200 rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            placeholder="Ingresa el precio de venta"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stock" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
            <FaBoxes className="text-orange-500 mr-2" />
            Stock
          </label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className="w-full p-2.5 border border-cream-200 rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
            placeholder="Ingresa el stock"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="block text-sm font-medium text-amber-900 mb-1 flex items-center">
          <FaListUl className="text-orange-500 mr-2" />
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2.5 border border-cream-200 rounded-md bg-cream-50 text-gray-700 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          rows="4"
          placeholder="Ingresa una descripción"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {editingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          {editingProduct ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;