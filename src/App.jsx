// src/App.jsx
// src/App.jsx
import { Routes, Route, NavLink } from 'react-router-dom';
import ProductsModule from './products';
import UsersModule from './modules/users/UsersModule';
import SalesModule from './modules/sales/SalesModule';
import ReportsModule from './modules/reports/ReportsModule';

export default function App() {
  return (
    <div className="min-h-screen bg-cream-50 text-gray-800 font-poppins">
      {/* Header */}
      <header className="bg-white/80 border-b border-cream-100">
        <div className="container mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-amber-900 tracking-tight">
            🥖 Panel de Administración
          </h1>
          <nav className="flex gap-4">
            <NavLink
              to="/productos"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-50'
                }`
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-50'
                }`
              }
            >
              Usuarios
            </NavLink>
            <NavLink
              to="/ventas"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-50'
                }`
              }
            >
              Ventas
            </NavLink>
            <NavLink
              to="/consultas"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition ${isActive ? 'bg-amber-100 text-amber-900' : 'hover:bg-amber-50'}`
              }
            >
              Consultas
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto p-6 md:p-8">
        <Routes>
          <Route path="/" element={<ProductsModule />} />
          <Route path="/productos" element={<ProductsModule />} />
          <Route path="/usuarios" element={<UsersModule />} />
          <Route path="/ventas" element={<SalesModule />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/consultas" element={<ReportsModule />} />
        </Routes>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-16">
      <p className="text-2xl">404 • Página no encontrada</p>
    </div>
  );
}

