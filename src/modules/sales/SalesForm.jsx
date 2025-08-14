import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SalesAPI } from '../../api/sales';
import { API_MONGO } from '../../config/api';

const API_PRODUCTS = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function SalesForm({ onClose, onCreated }) {
  // usuarios (vendedores/admins)
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');

  // catálogo de productos
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // carrito
  const [items, setItems] = useState([]); // [{product_id, name, unit_price, quantity, stock}]
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + (it.unit_price * it.quantity), 0),
    [items]
  );

  // Load users
  const loadUsers = async () => {
    try {
      const { data } = await axios.get(`${API_MONGO}/users`);
      const allowed = (data || []).filter(u => ['admin','vendedor'].includes(u.role));
      setUsers(allowed);
      if (allowed[0]) setUserId(allowed[0]._id || allowed[0].id);
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar usuarios');
    }
  };

  // Load products
  const loadProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('per_page', '100');

      const res = await fetch(`${API_PRODUCTS}/products?${params.toString()}`);
      const json = await res.json();
      const list = json.data || json;

      const normalized = list.map(p => ({
        id: p.id,
        name: p.name,
        sale_price: Number(p.sale_price) || 0,
        stock: Number(p.stock) || 0,
        category: p.category || '',
      }));
      setProducts(normalized);
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar productos');
    }
  };

  useEffect(() => { loadUsers(); loadProducts(); }, []);
  useEffect(() => {
    const t = setTimeout(loadProducts, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const addItem = (p) => {
    const exists = items.find(i => i.product_id === p.id);
    if (exists) {
      setItems(prev =>
        prev.map(i => i.product_id === p.id ? { ...i, quantity: Math.min(i.quantity + 1, p.stock) } : i)
      );
    } else {
      setItems(prev => [...prev, {
        product_id: p.id,
        name: p.name,
        unit_price: p.sale_price,
        quantity: 1,
        stock: p.stock,
      }]);
    }
  };

  const updateQty = (id, qty) => {
    setItems(prev =>
      prev.map(i =>
        i.product_id === id
          ? { ...i, quantity: Math.max(1, Math.min(qty || 1, i.stock)) }
          : i
      )
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.product_id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error('Selecciona un vendedor');
    if (items.length === 0) return toast.error('Agrega al menos un producto');

    setLoading(true);
    try {
      // 1) Verificar stock en API productos
      const stockRes = await axios.post(`${API_PRODUCTS}/products/check`, {
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      });

      // 2) Preparar payload con datos de productos desde check-stock
      const productsPayload = (stockRes.data?.products || []).map(p => ({
        product_id: p.product_id,
        name: p.name,
        unit_price: p.price,
        quantity: items.find(i => i.product_id === p.product_id)?.quantity || 1,
      }));

      // 3) Crear venta en API Mongo
      await SalesAPI.create({
        user_id: userId,
        products: productsPayload,
        payment_method: paymentMethod,
        customer_info: customer.name || customer.email ? customer : null,
      });

      // 4) Descontar stock en API productos
      await axios.post(`${API_PRODUCTS}/products/update-stock`, {
        items: productsPayload.map(p => ({ product_id: p.product_id, quantity: p.quantity })),
        operation: 'decrement',
      });

      toast.success('Venta registrada');
      await onCreated?.();
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || 'Error al registrar la venta';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay fijo a pantalla completa
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      {/* Contenedor del modal con scroll interno */}
      <div className="bg-white rounded-xl w-full max-w-5xl shadow-lg border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-amber-900">Nueva venta</h3>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>✖</button>
        </div>

        {/* Body con SCROLL */}
        <div className="p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600">Vendedor</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  {users.map(u => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Método de pago</label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Cliente (opcional)</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full border rounded-md px-3 py-2 mb-2"
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Correo"
                  className="w-full border rounded-md px-3 py-2"
                  value={customer.email}
                  onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            {/* Selector de productos */}
            <div className="border rounded-lg p-3">
              <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-3">
                <h4 className="font-semibold text-amber-900">Selecciona productos</h4>
                <div className="flex gap-2">
                  <input
                    className="border rounded-md px-3 py-2"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    className="border rounded-md px-3 py-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="blanco">Blanco</option>
                    <option value="integral">Integral</option>
                    <option value="dulce">Dulce</option>
                    <option value="artesanal">Artesanal</option>
                    <option value="sin_gluten">Sin Gluten</option>
                    <option value="regional">Regional</option>
                    <option value="enriquecido">Enriquecido</option>
                    <option value="de_molde">De Molde</option>
                    <option value="crujiente">Crujiente</option>
                    <option value="dulce_relleno">Dulce Relleno</option>
                    <option value="salado">Salado</option>
                    <option value="festivo">Festivo</option>
                    <option value="vegano">Vegano</option>
                  </select>
                </div>
              </div>

              <div className="max-h-56 overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map(p => (
                  <div key={p.id} className="border rounded-lg p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">${p.sale_price.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                    <button
                      type="button"
                      onClick={() => addItem(p)}
                      className="mt-2 w-full px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm"
                      disabled={p.stock <= 0}
                    >
                      Agregar
                    </button>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center text-gray-500 col-span-full">Sin resultados</div>
                )}
              </div>
            </div>

            {/* Carrito */}
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-amber-900 mb-2">Carrito</h4>
              {items.length === 0 ? (
                <div className="text-gray-500 text-sm">Aún no agregas productos</div>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 border text-left">Producto</th>
                        <th className="p-2 border">Precio</th>
                        <th className="p-2 border">Cantidad</th>
                        <th className="p-2 border">Subtotal</th>
                        <th className="p-2 border">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(it => (
                        <tr key={it.product_id}>
                          <td className="p-2 border">{it.name}</td>
                          <td className="p-2 border text-right">${it.unit_price.toFixed(2)}</td>
                          <td className="p-2 border text-center">
                            <input
                              type="number"
                              min={1}
                              max={it.stock}
                              value={it.quantity}
                              onChange={(e) => updateQty(it.product_id, parseInt(e.target.value || 1))}
                              className="w-20 border rounded-md px-2 py-1 text-center"
                            />
                            <div className="text-xs text-gray-500">Max: {it.stock}</div>
                          </td>
                          <td className="p-2 border text-right">
                            ${(it.unit_price * it.quantity).toFixed(2)}
                          </td>
                          <td className="p-2 border text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(it.product_id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="p-2 border font-medium text-right" colSpan={3}>Total</td>
                        <td className="p-2 border font-bold text-right">${total.toFixed(2)}</td>
                        <td className="p-2 border"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer del form */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                {loading ? 'Procesando...' : 'Registrar venta'}
              </button>
            </div>
          </form>
        </div>
        {/* /Body con SCROLL */}

      </div>
    </div>
  );
}
