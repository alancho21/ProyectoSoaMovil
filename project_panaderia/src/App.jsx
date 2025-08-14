import ProductsModule from './products';

function App() {
  return (
    <div className="min-h-screen bg-cream-50 text-gray-800 font-poppins">
      <div className="container mx-auto p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-8 tracking-tight">
          🥖 Gestión de Productos de Panadería
        </h1>
        <ProductsModule />
      </div>
    </div>
  );
}

export default App;