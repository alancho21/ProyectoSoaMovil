import { useEffect, useMemo, useState } from 'react';
import { ReportsAPI } from '../../api/reports';
import { toast } from 'react-toastify';

// Utils simples
function toCSV(rows, headers) {
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v).replaceAll('"', '""');
    return `"${s}"`;
  };
  const head = headers.map(h => esc(h.label)).join(',');
  const body = rows.map(r => headers.map(h => esc(r[h.key])).join(',')).join('\n');
  return head + '\n' + body;
}

function downloadBlob(filename, content, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsModule() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  // Filtros
  const [groupBy, setGroupBy] = useState('daily');
  const [userId, setUserId] = useState('');
  const [from, setFrom] = useState(() => new Date(Date.now() - 6*86400000).toISOString().slice(0,10));
  const [to, setTo]     = useState(() => new Date().toISOString().slice(0,10));

  const params = useMemo(() => {
    const p = { group_by: groupBy, date_from: from, date_to: to };
    if (userId) p.user_id = userId;
    return p;
  }, [groupBy, userId, from, to]);

  const load = async () => {
    try {
      setLoading(true);
      const data = await ReportsAPI.sales(params);
      setReport(data);
    } catch (e) {
      console.error(e);
      toast.error('Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setTimeout(() => load(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const exportCSV = (section) => {
    if (!report) return;
    if (section === 'by_day') {
      const headers = [
        { key: 'label',     label: 'Periodo' },
        { key: 'date_from', label: 'Desde' },
        { key: 'date_to',   label: 'Hasta' },
        { key: 'sales',     label: 'Ventas' },
        { key: 'items',     label: 'Artículos' },
        { key: 'total',     label: 'Total' },
      ];
      const csv = toCSV(report.by_day || [], headers);
      return downloadBlob(`reporte_por_periodo_${from}_a_${to}.csv`, csv);
    }
    if (section === 'by_user') {
      const headers = [
        { key: 'user_id', label: 'Usuario' },
        { key: 'sales',   label: 'Ventas' },
        { key: 'items',   label: 'Artículos' },
        { key: 'total',   label: 'Total' },
      ];
      const csv = toCSV(report.by_user || [], headers);
      return downloadBlob(`reporte_por_usuario_${from}_a_${to}.csv`, csv);
    }
    if (section === 'by_product') {
      const headers = [
        { key: 'product_id', label: 'Producto ID' },
        { key: 'name',       label: 'Nombre' },
        { key: 'quantity',   label: 'Cantidad' },
        { key: 'revenue',    label: 'Ingresos' },
      ];
      const csv = toCSV(report.by_product || [], headers);
      return downloadBlob(`reporte_por_producto_${from}_a_${to}.csv`, csv);
    }
  };

  const printReport = () => {
    window.print(); // usa los estilos de impresión del navegador → PDF
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-amber-900 tracking-tight">📈 Consultas y Reportes</h2>
          <p className="text-sm text-gray-500">Filtra el periodo, agrupa y exporta a CSV o imprime (PDF).</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => exportCSV('by_day')} className="px-3 py-2 bg-blue-500 text-white rounded-md">Exportar CSV (Periodo)</button>
          <button onClick={() => exportCSV('by_user')} className="px-3 py-2 bg-blue-500 text-white rounded-md">Exportar CSV (Usuarios)</button>
          <button onClick={() => exportCSV('by_product')} className="px-3 py-2 bg-blue-500 text-white rounded-md">Exportar CSV (Productos)</button>
          <button onClick={printReport} className="px-3 py-2 bg-amber-600 text-white rounded-md">Imprimir (PDF)</button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-wrap gap-4 print:hidden">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Desde</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Hasta</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Agrupar por</label>
          <select value={groupBy} onChange={e=>setGroupBy(e.target.value)} className="border rounded-md px-3 py-2">
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Usuario (opcional)</label>
          <input type="text" placeholder="user_id" value={userId} onChange={e=>setUserId(e.target.value)} className="border rounded-md px-3 py-2" />
        </div>
        <button onClick={load} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 self-end">Aplicar</button>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
          <p className="text-green-100 text-sm">Total Ventas</p>
          <p className="text-2xl font-bold">{report?.totals?.sales_count ?? '—'}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
          <p className="text-orange-100 text-sm">Artículos Vendidos</p>
          <p className="text-2xl font-bold">{report?.totals?.items_sold ?? '—'}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
          <p className="text-blue-100 text-sm">Ingresos</p>
          <p className="text-2xl font-bold">${(report?.totals?.total_amount ?? 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Por periodo */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-amber-900">Por {groupBy === 'daily' ? 'día' : groupBy === 'weekly' ? 'semana' : 'mes'}</h3>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-amber-50">
              <tr className="text-amber-900">
                <th className="p-2 border text-left">Periodo</th>
                <th className="p-2 border">Ventas</th>
                <th className="p-2 border">Artículos</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {(report?.by_day || []).map((r, i) => (
                <tr key={i} className={i%2?'bg-gray-50/60':''}>
                  <td className="p-2 border">{r.label} <span className="text-xs text-gray-400">({r.date_from}—{r.date_to})</span></td>
                  <td className="p-2 border text-center">{r.sales}</td>
                  <td className="p-2 border text-center">{r.items}</td>
                  <td className="p-2 border text-right font-semibold">${Number(r.total||0).toFixed(2)}</td>
                </tr>
              ))}
              {!report?.by_day?.length && (
                <tr><td className="p-3 text-center text-gray-500" colSpan={4}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Por usuario */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Por usuario</h3>
        <div className="overflow-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-amber-50">
              <tr className="text-amber-900">
                <th className="p-2 border text-left">Usuario</th>
                <th className="p-2 border">Ventas</th>
                <th className="p-2 border">Artículos</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {(report?.by_user || []).map((r, i) => (
                <tr key={i} className={i%2?'bg-gray-50/60':''}>
                  <td className="p-2 border">{r.user_id}</td>
                  <td className="p-2 border text-center">{r.sales}</td>
                  <td className="p-2 border text-center">{r.items}</td>
                  <td className="p-2 border text-right font-semibold">${Number(r.total||0).toFixed(2)}</td>
                </tr>
              ))}
              {!report?.by_user?.length && (
                <tr><td className="p-3 text-center text-gray-500" colSpan={4}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Por producto */}
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">Por producto</h3>
        <div className="overflow-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-amber-50">
              <tr className="text-amber-900">
                <th className="p-2 border text-left">Producto</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {(report?.by_product || []).map((r, i) => (
                <tr key={i} className={i%2?'bg-gray-50/60':''}>
                  <td className="p-2 border">{r.name} <span className="text-xs text-gray-400">#{r.product_id}</span></td>
                  <td className="p-2 border text-center">{r.quantity}</td>
                  <td className="p-2 border text-right font-semibold">${Number(r.revenue||0).toFixed(2)}</td>
                </tr>
              ))}
              {!report?.by_product?.length && (
                <tr><td className="p-3 text-center text-gray-500" colSpan={3}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
