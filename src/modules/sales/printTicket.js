export function printSaleTicket(sale) {
  // Normaliza productos con unit_price o price
  const items = Array.isArray(sale.products) ? sale.products.map(p => ({
    name: p.name,
    price: Number(p.unit_price ?? p.price ?? 0),
    quantity: Number(p.quantity || 0),
    subtotal: Number((p.unit_price ?? p.price ?? 0) * (p.quantity || 0)),
  })) : [];

  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
  const total = Number(sale.total || items.reduce((acc, it) => acc + it.subtotal, 0));

  const dateStr = sale.created_at
    ? new Date(sale.created_at).toLocaleString()
    : new Date().toLocaleString();

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Ticket</title>
  <style>
    body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; margin: 0; padding: 12px; }
    .ticket { width: 280px; margin: 0 auto; }
    .center { text-align: center; }
    .bold { font-weight: 700; }
    .small { font-size: 12px; color: #444; }
    .line { border-top: 1px dashed #aaa; margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { padding: 4px 0; }
    .right { text-align: right; }
    .muted { color: #666; }
    @media print {
      body { padding: 0; }
      .ticket { width: 58mm; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="center bold">Panadería La Buena Miga</div>
    <div class="center small">RFC: DEMO000000</div>
    <div class="center small">${dateStr}</div>
    <div class="small">Folio: ${(sale._id || sale.id) ?? '-'}</div>
    <div class="small">Vendedor: ${(sale.user_id) ?? '-'}</div>
    ${sale.customer_info ? `<div class="small">Cliente: ${sale.customer_info.name ?? ''} ${sale.customer_info.email ? '• ' + sale.customer_info.email : ''}</div>` : ''}
    <div class="line"></div>
    <table>
      <thead>
        <tr class="muted">
          <th style="text-align:left;">Producto</th>
          <th class="right">Cant</th>
          <th class="right">Precio</th>
          <th class="right">Subt</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(it => `
          <tr>
            <td>${escapeHtml(it.name)}</td>
            <td class="right">${it.quantity}</td>
            <td class="right">$${it.price.toFixed(2)}</td>
            <td class="right">$${it.subtotal.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="line"></div>
    <table>
      <tr><td class="muted">Artículos</td><td class="right bold">${totalItems}</td></tr>
      <tr><td class="muted">Método</td><td class="right">${sale.payment_method || '-'}</td></tr>
      <tr><td class="bold">TOTAL</td><td class="right bold">$${total.toFixed(2)}</td></tr>
    </table>
    <div class="line"></div>
    <div class="center small">¡Gracias por su compra!</div>
  </div>
  <script>
    window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };
  </script>
</body>
</html>
  `;

  const w = window.open('', '_blank', 'width=380,height=640');
  if (!w) return alert('Bloqueador de ventanas emergentes activo. Permite popups para imprimir el ticket.');
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
