import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaUser } from "react-icons/fa";

export default function VistaPerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const fetchPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setUsuario(data.usuario);
      } else {
        setMensaje("⚠️ No se pudo cargar el perfil.");
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setMensaje("⚠️ Error al conectar con el servidor.");
    }
  };

  const guardarCambios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_completo: usuario.nombre,  // 👈 porque en backend espera nombre_completo
          correo: usuario.correo,
          telefono: usuario.telefono,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setMensaje("✅ Datos actualizados correctamente.");
      } else {
        setMensaje("❌ Error al actualizar: " + (data.mensaje || ""));
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("❌ Error al conectar con el servidor.");
    } finally {
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (!usuario) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
        <FaUser /> Mi Perfil
      </h1>

      {mensaje && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded mb-4">
          {mensaje}
        </div>
      )}

      <div className="space-y-4 bg-white p-6 rounded shadow">
        {/* Nombre editable */}
        <div>
          <label className="block font-semibold text-gray-700">Nombre Completo:</label>
          <input
            type="text"
            value={usuario.nombre}
            onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
            className="w-full p-2 border rounded"
          />
          
        </div>

        {/* Correo editable */}
        <div>
          <label className="block font-semibold text-gray-700">Correo Electrónico:</label>
          <input
            type="email"
            value={usuario.correo}
            onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Teléfono editable */}
        <div>
          <label className="block font-semibold text-gray-700">Teléfono:</label>
          <input
            type="text"
            value={usuario.telefono || ""}
            onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Rol solo lectura */}
        <div>
          <label className="block font-semibold text-gray-700">Rol:</label>
          <input
            type="text"
            value={usuario.rol}
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Password solo lectura */}
        <div>
          <label className="block font-semibold text-gray-700">Contraseña:</label>
          <input
            type="password"
            value="********"
            disabled
            className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            <FaArrowLeft /> Volver
          </button>
          <button
            onClick={guardarCambios}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            <FaSave /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
