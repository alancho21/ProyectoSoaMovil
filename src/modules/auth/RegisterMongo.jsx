import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { mongoRegister } from "../../api/mongoAuth";

export default function RegisterFancy() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await mongoRegister(form.name, form.email, form.password);
      toast.success("¡Cuenta creada con éxito!");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  const BG =
    "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?q=80&w=1600&auto=format&fit=crop";

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${BG})` }}
    >
      {/* 1) Tinte cálido muy leve */}
      <div className="absolute inset-0 bg-amber-800/25" />

      {/* 2) Vignette vertical (mejora la lectura sin opacar la foto) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />

      {/* 3) Vignette horizontal muy suave */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20" />

      {/* Contenido centrado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Card */}
        <div className="w-full max-w-md rounded-2xl bg-white/85 backdrop-blur-[2px] shadow-xl ring-1 ring-white/40">
          <div className="p-8">
            <div className="mb-6">
              <h3 className="font-semibold text-2xl text-amber-900">
                Crear cuenta
              </h3>
              <p className="text-stone-600 mt-1">
                Rellena tus datos para comenzar.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Nombre</label>
                <input
                  className="w-full text-base px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/70"
                  type="text"
                  name="name"
                  placeholder="Juan Pérez"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Correo</label>
                <input
                  className="w-full text-base px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/70"
                  type="email"
                  name="email"
                  placeholder="mail@gmail.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Contraseña
                </label>
                <input
                  className="w-full text-base px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200/70"
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white p-3 rounded-full tracking-wide font-semibold shadow-lg shadow-amber-900/10 transition transform active:scale-[.98]"
              >
                {loading ? "Registrando..." : "Registrarme"}
              </button>
            </form>

            <div className="pt-6 text-center text-stone-600 text-sm">
              <span>
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="text-amber-700 hover:text-amber-800 font-medium"
                >
                  Inicia sesión
                </Link>
              </span>
            </div>

            <div className="mt-4 text-center text-stone-400 text-xs">
              <span>
                © {new Date().getFullYear()} Panadería SOA. Hecho con ♥ y azúcar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


