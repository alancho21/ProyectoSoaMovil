import { useEffect, useState, useMemo } from 'react';
import { SalesAPI } from '../../api/sales';
import { toast } from 'react-toastify';
import { printSaleTicket } from './printTicket';

export default function SaleDetailModal({ saleId, onClose }) {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalItems = useMemo(() => {
    if (!sale?.products) return 0;
    return sale.products.reduce((acc, p) => acc + (p.quantity || 0), 0);
  }, [sale]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await SalesAPI.get(saleId);
        setSale(data);
      } catch (e) {
        console.error(e);
        toast.error('Error al cargar detalle de la venta');
        onClose?.();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [saleId, onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-lg border max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-amber-900">Detalle de la venta</h3>
          <button className="text-gray-600 hover:text-gray-800" onClick={onClose}>✖</button>
        </div>

        <div className="p-4 overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
              <p className="text-amber-700 font-medium mt-2">Cargando...</p>
            </div>
          )}

          {!loading && sale && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-500">Folio</div>
                  <div className="font-medium break-all">{sale._id || sale.id}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-500">Fecha</div>
                  <div className="font-medium">
                    {sale.created_at ? new Date(sale.created_at).toLocaleString() : '—'}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-500">Vendedor</div>
                  <div className="font-medium">{sale.user_id || '—'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-500">Método de pago</div>
                  <div className="font-medium">{sale.payment_method}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-500">Estatus</div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full border ${
                        sale.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm text-gray-500">Cliente</div>
                  <div className="font-medium">
                    {sale.customer_info?.name || '—'}
                    {sale.customer_info?.email ? ` • ${sale.customer_info.email}` : ''}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="px-3 py-2 border-b bg-gray-50 font-medium">Productos</div>
                <div className="overflow-auto">
                  <table className="min-w-full">
                    <thead className="bg-white">
                      <tr className="text-sm text-gray-600">
                        <th className="p-2 text-left">Producto</th>
                        <th className="p-2 text-right">Precio</th>
                        <th className="p-2 text-center">Cantidad</th>
                        <th className="p-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sale.products?.map((p, i) => {
                        const unit = Number(p.unit_price ?? p.price ?? 0);
                        return (
                          <tr key={i} className="border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2 text-right">${unit.toFixed(2)}</td>
                            <td className="p-2 text-center">{p.quantity}</td>
                            <td className="p-2 text-right">${(unit * (p.quantity || 0)).toFixed(2)}</td>
                          </tr>
                        );
                      })}
                      <tr className="border-t bg-gray-50">
                        <td className="p-2 text-right font-medium" colSpan={3}>Artículos</td>
                        <td className="p-2 text-right font-semibold">{totalItems}</td>
                      </tr>
                      <tr className="border-t bg-gray-50">
                        <td className="p-2 text-right font-medium" colSpan={3}>Total</td>
                        <td className="p-2 text-right font-bold text-amber-700">
                          ${Number(sale.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          {sale && (
            <button
              onClick={() => printSaleTicket(sale)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Imprimir ticket
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
