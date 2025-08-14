import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { mongoLogin } from "../../api/mongoAuth";

export default function LoginFancy() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await mongoLogin(form.email, form.password);
      localStorage.setItem("mongo_token", token);
      toast.success("¡Bienvenido!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  const BG =
    "https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=1600&auto=format&fit=crop&q=80";

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative min-h-screen"
      style={{ backgroundImage: `url(${BG})` }}
    >
      {/* Overlay cálido café/ámbar */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/80 via-amber-800/70 to-amber-700/60 z-0" />

      <div className="relative z-10 min-h-screen flex justify-center">
        {/* Lado izquierdo: texto */}
        <div className="hidden lg:flex flex-col self-center p-10 max-w-2xl text-amber-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
          <h1
            className="mb-3 text-8xl"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
        >
            ¡Bienvenido!
            Panadería Potros
            </h1>


          <p className="pr-2 opacity-80">
            Administra los productos de la panadería, usuarios y más desde un
            panel simple y delicioso.
            @UPP PROYECTS🧑‍🍳
          </p>
        </div>

        {/* Card de login */}
        <div className="flex justify-center self-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-2xl border border-amber-100/50 bg-white/95 backdrop-blur-sm shadow-xl shadow-amber-900/5 p-8">
            <div className="mb-6">
              <h3 className="font-semibold text-2xl text-amber-900">
                Iniciar sesión
              </h3>
              <p className="text-stone-500 mt-1">
                Ingresa con tu correo y contraseña.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Correo
                </label>
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
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="pt-6 text-center text-stone-500 text-sm">
              <span>
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Regístrate
                </Link>
              </span>
            </div>

            <div className="mt-4 text-center text-stone-400 text-xs">
              <span>
                © {new Date().getFullYear()} Panadería SOA. Hecho con ♥ y
                azúcar.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

