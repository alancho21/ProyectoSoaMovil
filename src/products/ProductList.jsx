import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [productToDelete, setProductToDelete] = useState(null);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'blanco': 'Blanco',
      'integral': 'Integral', 
      'dulce': 'Dulce',
      'artesanal': 'Artesanal',
      'sin_gluten': 'Sin Gluten',
      'regional': 'Regional',
      'enriquecido': 'Enriquecido',
      'de_molde': 'De Molde',
      'crujiente': 'Crujiente',
      'dulce_relleno': 'Dulce Relleno',
      'salado': 'Salado',
      'festivo': 'Festivo',
      'vegano': 'Vegano'
    };
    return categoryMap[category] || category;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-red-600 bg-red-50', text: 'Sin stock' };
    if (stock <= 10) return { color: 'text-orange-600 bg-orange-50', text: `Bajo: ${stock}` };
    return { color: 'text-green-600 bg-green-50', text: `Stock: ${stock}` };
  };

  return (
    <>
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-medium">
          No hay productos registrados
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const stockStatus = getStockStatus(product.stock);
            const margin = ((product.sale_price - product.purchase_price) / product.purchase_price * 100);
            
            return (
              <div 
                key={product.id} 
                className="bg-white p-4 rounded-xl shadow-sm border border-cream-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-amber-900 line-clamp-2 flex-1">
                    {product.name}
                  </h3>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full ml-2 ${stockStatus.color}`}>
                    {stockStatus.text}
                  </span>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Compra:</span>
                    <span className="font-medium">${(product.purchase_price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Venta:</span>
                    <span className="font-medium text-orange-600">${(product.sale_price || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Margen:</span>
                    <span className={`font-medium ${margin > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {isNaN(margin) ? '0%' : `${margin.toFixed(1)}%`}
                    </span>
                  </div>
                </div>

                {product.category && (
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full mb-2">
                    {getCategoryDisplayName(product.category)}
                  </span>
                )}

                {product.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="flex-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProductList;