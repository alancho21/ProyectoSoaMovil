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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`, { redirect: 'follow' });
      if (!res.ok) throw new Error(`Error al cargar productos: ${res.statusText}`);
      const data = await res.json();
      
      const formattedProducts = data.map(product => ({
        ...product,
        purchase_price: Number(product.purchase_price) || 0,
        sale_price: Number(product.sale_price) || 0,
        stock: Number(product.stock) || 0,
        category: product.category || ''
      }));
      
      setProducts(formattedProducts);
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

  const handleSubmit = async (productData) => {
    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload = {
        name: productData.name,
        description: productData.description,
        purchase_price: parseFloat(productData.purchase_price) || 0,
        sale_price: parseFloat(productData.sale_price) || 0,
        category: productData.category || '',
        stock: parseInt(productData.stock) || 0
      };

      console.log('Enviando payload a:', url, payload); // Depuración
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error en ${method} request: ${res.status} - ${res.statusText}`);
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
        toast.success('¡Producto actualizado!');
      } else {
        setProducts(prev => [...prev, {
          ...result,
          purchase_price: Number(result.purchase_price) || 0,
          sale_price: Number(result.sale_price) || 0,
          stock: Number(result.stock) || 0,
          category: result.category || ''
        }]);
        toast.success('¡Producto creado!');
      }
      
      setEditingProduct(null);
    } catch (err) {
      console.error('Error submitting product:', err);
      toast.error(`Error: ${err.message}. Revisa la consola para más detalles.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, { 
        method: 'DELETE',
        redirect: 'follow' 
      });
      if (!res.ok) throw new Error(`Error al eliminar producto: ${res.statusText}`);
      setProducts(products.filter(p => p.id !== id));
      toast.success('¡Producto eliminado!');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-12 text-amber-700 font-medium">Cargando productos...</div>;
  if (error) return <div className="text-red-500 text-center py-12 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
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

      <div className="bg-white p-6 rounded-xl shadow-sm border border-cream-100">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4 tracking-tight">📦 Lista de Productos</h2>
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