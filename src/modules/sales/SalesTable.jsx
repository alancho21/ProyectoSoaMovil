import { printSaleTicket } from './printTicket';

export default function SalesTable({ sales, loading, onCancel, onView }) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
        <p className="text-amber-700 font-medium mt-2">Cargando ventas...</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
          <tr className="text-amber-900">
            <th className="p-3 border text-left">Fecha</th>
            <th className="p-3 border text-left">Vendedor</th>
            <th className="p-3 border">Items</th>
            <th className="p-3 border">Total</th>
            <th className="p-3 border">Método</th>
            <th className="p-3 border">Estatus</th>
            <th className="p-3 border">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sales.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={7}>
                No hay ventas registradas
              </td>
            </tr>
          )}
          {sales.map((s, idx) => {
            const totalItems = Array.isArray(s.products)
              ? s.products.reduce((acc, p) => acc + (p.quantity || 0), 0)
              : 0;

            return (
              <tr
                key={s._id || s.id}
                className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
              >
                <td className="p-3 border">
                  {s.created_at ? new Date(s.created_at).toLocaleString() : '—'}
                </td>
                <td className="p-3 border">{s.user_id || '—'}</td>
                <td className="p-3 border text-center">{totalItems}</td>
                <td className="p-3 border text-right font-semibold">
                  ${Number(s.total || 0).toFixed(2)}
                </td>
                <td className="p-3 border text-center">{s.payment_method}</td>
                <td className="p-3 border text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${
                      s.status === 'cancelled'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3 border text-center">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => onView?.(s)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => printSaleTicket(s)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                    >
                      Ticket
                    </button>
                    {s.status !== 'cancelled' && (
                      <button
                        onClick={() => onCancel?.(s)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
