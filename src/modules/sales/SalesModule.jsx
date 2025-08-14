import { useEffect, useMemo, useState } from 'react';
import { SalesAPI } from '../../api/sales';
import axios from 'axios';
import { toast } from 'react-toastify';
import SalesTable from './SalesTable';
import SalesForm from './SalesForm';
import SaleDetailModal from './SaleDetailModal';

const API_PRODUCTS = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function SalesModule() {
  const [sales, setSales] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [detailId, setDetailId] = useState(null); // <- venta seleccionada para detalle

  // Filtros
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const queryParams = useMemo(() => {
    const p = {};
    if (status) p.status = status;
    if (dateFrom && dateTo) {
      p.date_from = dateFrom;
      p.date_to = dateTo;
    }
    return p;
  }, [status, dateFrom, dateTo]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await SalesAPI.list(queryParams);
      if (data?.data && Array.isArray(data.data)) {
        setSales(data.data);
        setMeta(data.meta || null);
      } else {
        setSales(Array.isArray(data) ? data : []);
        setMeta(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const handleCancelSale = async (sale) => {
    if (!confirm('¿Cancelar esta venta?')) return;
    try {
      const result = await SalesAPI.cancel(sale._id || sale.id, {
        user_id: sale.user_id,
      });

      await axios.post(`${API_PRODUCTS}/products/update-stock`, {
        items: result.products,
        operation: 'increment',
      });

      toast.success('Venta cancelada y stock repuesto');
      await load();
    } catch (err) {
      console.error(err);
      toast.error('Error al cancelar la venta');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-amber-900 tracking-tight">
            🧾 Ventas
          </h2>
          <p className="text-sm text-gray-500">
            Consulta, detalla e imprime tickets. Registra nuevas ventas validando stock.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm"
        >
          ➕ Nueva venta
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
        <div>
          <label className="text-sm text-gray-600">Estatus</label>
          <select
            className="block border rounded-md px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Desde</label>
          <input
            type="date"
            className="block border rounded-md px-3 py-2"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Hasta</label>
          <input
            type="date"
            className="block border rounded-md px-3 py-2"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button
          onClick={load}
          className="h-10 mt-5 md:mt-0 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Aplicar
        </button>
        {(status || (dateFrom && dateTo)) && (
          <button
            onClick={() => { setStatus(''); setDateFrom(''); setDateTo(''); }}
            className="h-10 mt-5 md:mt-0 px-4 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <SalesTable
          sales={sales}
          loading={loading}
          onCancel={handleCancelSale}
          onView={(sale) => setDetailId(sale._id || sale.id)}
        />
      </div>

      {/* Modal/Form con overlay */}
      {showForm && (
        <SalesForm
          onClose={() => setShowForm(false)}
          onCreated={async () => { setShowForm(false); await load(); }}
        />
      )}

      {/* Modal Detalle */}
      {detailId && (
        <SaleDetailModal
          saleId={detailId}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}
