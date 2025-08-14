import { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ProductsModule = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { value: '', label: 'Todas las categorías' },
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      params.append('per_page', '100');

      const queryString = params.toString();
      const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`Error al cargar productos: ${res.statusText}`);
      
      const data = await res.json();
      
      // Manejar respuesta paginada del backend Laravel
      const productsData = data.data || data;
      
      const formattedProducts = productsData.map(product => ({
        ...product,
        purchase_price: Number(product.purchase_price) || 0,
        sale_price: Number(product.sale_price) || 0,
        stock: Number(product.stock) || 0,
        category: product.category || ''
      }));
      
      setProducts(formattedProducts);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Error al cargar productos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter]);

  const handleSubmit = async (productData) => {
    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload = {
        name: productData.name,
        description: productData.description || '',
        purchase_price: parseFloat(productData.purchase_price) || 0,
        sale_price: parseFloat(productData.sale_price) || 0,
        category: productData.category || '',
        stock: parseInt(productData.stock) || 0
      };

      console.log('Enviando payload a:', url, payload);
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }
      
      const result = await res.json();
      
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? {
          ...result,
          purchase_price: Number(result.purchase_price) || 0,
          sale_price: Number(result.sale_price) || 0,
          stock: Number(result.stock) || 0,
          category: result.category || ''
        } : p));
        toast.success('🎉 ¡Producto actualizado exitosamente!');
      } else {
        setProducts(prev => [...prev, {
          ...result,
          purchase_price: Number(result.purchase_price) || 0,
          sale_price: Number(result.sale_price) || 0,
          stock: Number(result.stock) || 0,
          category: result.category || ''
        }]);
        toast.success('🎉 ¡Producto creado exitosamente!');
      }
      
      setEditingProduct(null);
    } catch (err) {
      console.error('Error submitting product:', err);
      toast.error(`❌ Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { 
        method: 'DELETE',
        headers: { 
          'Accept': 'application/json'
        },
        redirect: 'follow' 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error al eliminar: ${res.statusText}`);
      }
      
      setProducts(products.filter(p => p.id !== id));
      toast.success('🗑️ ¡Producto eliminado exitosamente!');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(`❌ Error al eliminar: ${err.message}`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
  };

  const filteredProductsCount = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 10).length;
  const totalValue = products.reduce((acc, p) => acc + (p.sale_price * p.stock), 0);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
        <p className="text-amber-700 font-medium mt-2">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-12">
        <p className="font-medium mb-2">⚠️ Error al cargar productos</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Panel de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <p className="text-blue-100 text-sm">Total Productos</p>
          <p className="text-2xl font-bold">{filteredProductsCount}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <p className="text-orange-100 text-sm">Stock Bajo</p>
          <p className="text-2xl font-bold">{lowStockProducts}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <p className="text-green-100 text-sm">Valor Total Inventario</p>
          <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-cream-100">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4 tracking-tight">
          {editingProduct ? '✏️ Editar Producto' : '➕ Agregar Producto'}
        </h2>
        <ProductForm 
          onSubmit={handleSubmit} 
          editingProduct={editingProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </div>

      {/* Lista de productos */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-cream-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-semibold text-amber-900 tracking-tight">
            📦 Lista de Productos
          </h2>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-cream-200 rounded-md bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-cream-200 rounded-md bg-cream-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {(searchTerm || categoryFilter) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                ❌ Limpiar
              </button>
            )}
          </div>
        </div>

        <ProductList 
          products={products} 
          onEdit={setEditingProduct} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default ProductsModule;