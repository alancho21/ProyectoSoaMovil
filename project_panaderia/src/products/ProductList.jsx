import { useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [productToDelete, setProductToDelete] = useState(null);

  const handleConfirmDelete = () => {
    onDelete(productToDelete);
    setProductToDelete(null);
  };

  return (
    <>
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500 font-medium">
          No hay productos registrados
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-cream-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-amber-900 mb-1">{product.name}</h3>
              <div className="space-y-1 mb-2">
                <p className="text-sm text-gray-600">Compra: ${product.purchase_price?.toFixed(2) || '0.00'}</p>
                <p className="text-orange-600 font-medium">Venta: ${product.sale_price?.toFixed(2) || '0.00'}</p>
              </div>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              {product.category && (
                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2.5 py-1 rounded-full mt-2 capitalize">
                  {product.category.replace('_', ' ')}
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
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setProductToDelete(product.id)}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
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