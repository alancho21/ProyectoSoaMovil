import React, { useState } from "react";
import { mongoLogin } from "../../api/mongoAuth"; // tu función actual
import { useNavigate } from "react-router-dom";

export default function LoginMongo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await mongoLogin(form.email, form.password);
    if (success) navigate("/");
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white flex rounded-2xl shadow-lg max-w-3xl p-5">
        
        {/* Left Image Section */}
        <div
          className="w-1/2 bg-cover bg-center rounded-l-2xl hidden md:block"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1608198093002-fbb0ef47d5a5?auto=format&fit=crop&w=800&q=80')",
          }}
        ></div>

        {/* Form Section */}
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-amber-900">Sign In</h2>
          <p className="text-sm mt-4 text-gray-600">
            Please sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="p-3 mt-8 rounded-xl border"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="p-3 rounded-xl border"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="bg-amber-500 text-white py-2 rounded-xl hover:scale-105 duration-300"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
            <hr className="border-gray-400" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-400" />
          </div>

          <p className="mt-5 text-xs border-b border-gray-400 py-4">
            Forgot your password?
          </p>

          <div className="mt-3 text-xs flex justify-between items-center text-gray-400">
            <p>Don't have an account?</p>
            <button
              onClick={() => navigate("/register")}
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

