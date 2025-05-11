import { useEffect, useState } from "react";
import { FaUserEdit, FaTrash, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function VistaEditUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre_completo: "",
    correo: "",
    password: "",
    telefono: "",
    rol: "Secretaria",
    id_especialidad: "",
  });
  const navigate = useNavigate();

  const especialidades = [
    { id: 1, nombre: "General" },
    { id: 2, nombre: "Urgencias" },
    { id: 3, nombre: "Pediatría" },
    { id: 4, nombre: "Oftalmología" },
  ];

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const resUsuarios = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usuariosData = await resUsuarios.json();
      if (usuariosData.ok) setUsuarios(usuariosData.usuarios);

      const resRoles = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rolesData = await resRoles.json();
      if (rolesData.ok) setRolesDisponibles(rolesData.roles);
    } catch (error) {
      console.error("Error cargando usuarios o roles:", error);
    }
  };

  const cambiarRol = async (idUsuario, nuevoRolNombre) => {
    const id_rol = rolesDisponibles.find(r => r.nombre_rol === nuevoRolNombre)?.id_rol;

    if (!id_rol) {
      setMensaje("Rol no válido");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${idUsuario}/rol`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_rol }),
      });
      fetchUsuarios();
    } catch (error) {
      console.error("Error cambiando rol:", error);
    }
  };

  const guardarEdicionUsuario = async () => {
    const token = localStorage.getItem("token");
    const { id_usuario, nombre_completo, correo, telefono, rol, id_especialidad } = usuarioEditando;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_completo,
          correo,
          telefono,
          id_especialidad: rol === "Medico" ? Number(id_especialidad) : null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        await cambiarRol(id_usuario, rol);
        setMensaje("✅ Usuario editado correctamente.");
        setUsuarioEditando(null);
        fetchUsuarios();
        setTimeout(() => setMensaje(""), 4000); // ✅ limpiar mensaje a los 4 segundos
      } else {
        setMensaje("❌ Error al editar usuario.");
        setTimeout(() => setMensaje(""), 4000); // ✅ limpiar mensaje a los 4 segundos
      }
    } catch (error) {
      console.error("Error editando usuario:", error);
      setTimeout(() => setMensaje(""), 4000); // ✅ limpiar mensaje a los 4 segundos
    }
  };

  const eliminarUsuario = async (idUsuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/${idUsuario}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("Usuario eliminado correctamente.");
      fetchUsuarios();
      setTimeout(() => setMensaje(""), 4000); // ✅ limpiar mensaje a los 4 segundos
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setTimeout(() => setMensaje(""), 4000); // ✅ limpiar mensaje a los 4 segundos
    }
  };

  
  const crearUsuario = async () => {
    if (!nuevoUsuario.nombre_completo || !nuevoUsuario.correo || !nuevoUsuario.password) {
      setMensaje("❌ Por favor completa todos los campos.");
      setTimeout(() => setMensaje(""), 4000);
      return;
    }
  
    const id_rol = rolesDisponibles.find(r => r.nombre_rol === nuevoUsuario.rol)?.id_rol;
  
    if (!id_rol) {
      setMensaje("❌ Rol no válido.");
      setTimeout(() => setMensaje(""), 4000);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre_completo: nuevoUsuario.nombre_completo,
          correo: nuevoUsuario.correo,
          telefono: nuevoUsuario.telefono || null,
          password: nuevoUsuario.password,
          id_rol,
          id_especialidad: nuevoUsuario.rol === "Medico" ? Number(nuevoUsuario.id_especialidad) : null,
        }),
      });
  
      let data = {};
      const text = await res.text(); // 👈 capturamos la respuesta cruda
      try {
        data = text ? JSON.parse(text) : {}; // 👈 intentamos parsear solo si no está vacío
      } catch (err) {
        console.error("⚠️ Respuesta no es JSON válido:", err);
      }
  
      if (res.ok && data.ok) {
        setMensaje("✅ Usuario creado exitosamente.");
        setNuevoUsuario({
          nombre_completo: "",
          correo: "",
          password: "",
          telefono: "",
          rol: "Secretaria",
          id_especialidad: "",
        });
        fetchUsuarios();
      } else {
        setMensaje(`❌ Error al crear usuario: ${data.mensaje || 'Respuesta inesperada del servidor'}`);
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
      setMensaje("❌ Error al conectar con el servidor.");
    } finally {
      setTimeout(() => setMensaje(""), 4000);
    }
  };
  

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="p-6 space-y-10">
    {mensaje && (
  <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white 
    ${mensaje.startsWith('✅') ? 'bg-green-500' : 'bg-red-500'}`}>
    {mensaje}
  </div>
)}


      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-700">👥 Gestión de Usuarios</h2>
        <button
          onClick={() => navigate("/dashboard/admin")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📋 Usuarios Registrados</h3>
        <div className="overflow-x-auto max-w-full">
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-indigo-100">
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Correo</th>
              <th className="py-2 px-4 border">Teléfono</th>
              <th className="py-2 px-4 border">Rol</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id_usuario} className="hover:bg-gray-100">
                <td className="py-2 px-4 border">{usuario.nombre_completo}</td>
                <td className="py-2 px-4 border">{usuario.correo}</td>
                <td className="py-2 px-4 border">{usuario.telefono || "-"}</td>
                <td className="py-2 px-4 border">{rolesDisponibles.find(r => r.id_rol === usuario.id_rol)?.nombre_rol || "Desconocido"}</td>
                <td className="py-2 px-4 border flex gap-2">
                  <button
                    onClick={() => setUsuarioEditando(usuario)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FaUserEdit /> Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(usuario.id_usuario)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {usuarios.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No hay usuarios registrados.
          </p>
        )}
      </div>

      {usuarioEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-full max-w-md">
            <h3 className="text-xl font-bold">✏️ Editar Usuario</h3>
            <input
              type="text"
              value={usuarioEditando.nombre_completo}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nombre_completo: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="email"
              value={usuarioEditando.correo}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, correo: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <input
              type="text"
              value={usuarioEditando.telefono}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, telefono: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <select
              value={usuarioEditando.rol}
              onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}
              className="border p-2 w-full rounded"
            >
              {rolesDisponibles.map(r => (
                <option key={r.id_rol} value={r.nombre_rol}>{r.nombre_rol}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUsuarioEditando(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={guardarEdicionUsuario}
                className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

<div className="bg-white shadow rounded-lg p-6 mt-10">
  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
    <FaPlus /> Crear Nuevo Usuario
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      placeholder="Nombre Completo"
      value={nuevoUsuario.nombre_completo}
      onChange={(e) =>
        setNuevoUsuario({ ...nuevoUsuario, nombre_completo: e.target.value })
      }
      className="border p-2 rounded"
    />
    <input
      type="email"
      placeholder="Correo"
      value={nuevoUsuario.correo}
      onChange={(e) =>
        setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
      }
      className="border p-2 rounded"
    />
    <input
      type="text"
      placeholder="Teléfono"
      value={nuevoUsuario.telefono}
      onChange={(e) =>
        setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })
      }
      className="border p-2 rounded"
    />
    <input
      type="password"
      placeholder="Contraseña"
      value={nuevoUsuario.password}
      onChange={(e) =>
        setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
      }
      className="border p-2 rounded"
    />
    <select
      value={nuevoUsuario.rol}
      onChange={(e) =>
        setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
      }
      className="border p-2 rounded"
    >
      <option value="">Selecciona un rol</option>
      <option value="Administrador">Administrador</option>
      <option value="Secretaria">Secretaria</option>
      <option value="Medico">Médico</option>
      <option value="Coordinador">Coordinador</option>
    </select>

    {nuevoUsuario.rol === "Medico" && (
      <select
        value={nuevoUsuario.id_especialidad || ""}
        onChange={(e) =>
          setNuevoUsuario({
            ...nuevoUsuario,
            id_especialidad: e.target.value,
          })
        }
        className="border p-2 rounded"
      >
        <option value="">Selecciona una especialidad</option>
        {especialidades.map((esp) => (
          <option key={esp.id} value={esp.id}>
            {esp.nombre}
          </option>
        ))}
      </select>
    )}
  </div>

  <div className="mt-6 text-center">
    <button
      onClick={crearUsuario}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow"
    >
      Guardar Usuario
    </button>
  </div>
</div>
      
      </div>
  );
}
