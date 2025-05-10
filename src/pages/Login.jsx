import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        const decoded = jwtDecode(data.token);
        console.log("🧩 Token decodificado:", decoded);

        setUser({
          id: decoded.id,
          rol: decoded.rol,
        });

        Swal.fire({
          title: "¡Bienvenido!",
          text: "Login exitoso.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          const rol = decoded.rol;

          switch (rol) {
            case "Administrador":
              navigate("/dashboard/admin");
              break;
            case "Secretaria":
              navigate("/dashboard/secretaria");
              break;
            case "Medico":
              navigate("/dashboard/medico");
              break;
            default:
              console.warn("❓ Rol no reconocido:", rol);
              navigate("/");
              break;
          }
        });
      } else {
        Swal.fire({
          title: "Error de inicio de sesión",
          text: data.mensaje || "Credenciales incorrectas",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error del servidor",
        text: "No se pudo conectar con el backend.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <img
          src={logo}
          alt="Logo IN-MED"
          className="mx-auto mb-4 w-24 h-24 object-contain rounded-full"
        />
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin}>
          {/* Correo */}
          <div className="mb-5">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?
            <a
              href="/register"
              className="text-indigo-700 hover:underline ml-1 font-medium"
            >
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
