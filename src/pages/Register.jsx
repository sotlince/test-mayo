import { useState } from "react";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";



export default function Register() {
  const [form, setForm] = useState({
    nombre_completo: "",
    correo: "",
    telefono: "",
    password: "",
    rol: "",
    especialidad: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const obtenerIdRol = (rol) => {
    switch (rol) {
      case "Administrador": return 1;
      case "Secretaria": return 2;
      case "Medico": return 3;
      //case "Coordinador": return 4;
      default: return null;
    }
  };

  const especialidades = [
    { id: 1, nombre: "General" },
    { id: 2, nombre: "Urgencias" },
    { id: 3, nombre: "Pediatría" },
    { id: 4, nombre: "Oftalmología" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id_rol = obtenerIdRol(form.rol);
    const id_especialidad = form.rol === "Medico" ? Number(form.especialidad) : null;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: form.nombre_completo,
          correo: form.correo,
          telefono: form.telefono,
          password: form.password,
          id_rol,
          id_especialidad,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "✅ Registro exitoso",
          text: data.mensaje,
          icon: "success",
          confirmButtonColor: "#4f46e5",
        }).then(() => {
          navigate("/login"); // ✅ redirección aquí
        });

        setForm({
          nombre_completo: "",
          correo: "",
          telefono: "",
          password: "",
          rol: "",
          especialidad: "",
        });
      } else {
        Swal.fire({
          title: "❌ Error al registrar",
          text: data.mensaje || "Error desconocido.",
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "⚠️ Error de conexión",
        text: "No se pudo conectar con el backend.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-2">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-4">

      <img
  src={logo}
  alt="Logo"
  className="mx-auto mb-1 w-20 h-20 object-contain rounded-full"
/>

        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
          Crear nuevo usuario
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="nombre_completo"
            type="text"
            placeholder="Nombre completo"
            className="input"
            value={form.nombre_completo}
            onChange={handleChange}
            required
          />

          <input
            name="correo"
            type="email"
            placeholder="Correo electrónico"
            className="input"
            value={form.correo}
            onChange={handleChange}
            required
          />

          <input
            name="telefono"
            type="text"
            placeholder="Teléfono"
            className="input"
            value={form.telefono}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="input"
            value={form.password}
            onChange={handleChange}
            required
          />

          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Selecciona un rol</option>
            {/* <option value="Administrador">Administrador</option> */}
            <option value="Secretaria">Secretaria</option>
            <option value="Medico">Médico</option>
            
          </select>

          {form.rol === "Medico" && (
            <select
              name="especialidad"
              value={form.especialidad}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Selecciona una especialidad</option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Registrando..." : "Registrar usuario"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?
            <a href="/login" className="text-indigo-700 hover:underline ml-1 font-medium">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
