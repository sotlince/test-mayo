import { useEffect, useState } from "react";
import { FaUser, FaTrash, FaEye, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import ModalVerPaciente from "../admin/ModalVerPaciente"; // Ajusta si cambia tu estructura

export default function VistaPacientesAdmin() {
  const { usuario } = useOutletContext();
  const [pacientes, setPacientes] = useState([]);
  const [pacienteDetalle, setPacienteDetalle] = useState(null);
  const [filtro, setFiltro] = useState("hoy");
  const navigate = useNavigate();
  const volver = () => navigate("/dashboard/admin");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/api/pacientes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPacientes(data.pacientes);
      });
  }, []);

  const hoy = new Date();

  const pacientesFiltrados = pacientes.filter(p => {
    if (!p.fecha_creacion) return true; // Si no tiene fecha, lo dejamos pasar
  
    const fechaPaciente = new Date(p.fecha_creacion);
  
    if (filtro === "hoy") {
      return (
        fechaPaciente.getDate() === hoy.getDate() &&
        fechaPaciente.getMonth() === hoy.getMonth() &&
        fechaPaciente.getFullYear() === hoy.getFullYear()
      );
    }
  
    if (filtro === "mes") {
      return (
        fechaPaciente.getMonth() === hoy.getMonth() &&
        fechaPaciente.getFullYear() === hoy.getFullYear()
      );
    }
  
    return true;
  });

  const eliminarPaciente = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este paciente?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/api/pacientes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        alert("Paciente eliminado exitosamente.");
        setPacientes(prev => prev.filter(p => p.id_paciente !== id));
      } else {
        alert("No se pudo eliminar el paciente.");
      }
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
    }
  };

  return (
    <div className="p-6">
       {/* Encabezado con volver */}
       <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <FaUser /> Gestión de Pacientes
        </h2>
        <button
          onClick={volver}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${filtro === "hoy" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("hoy")}
        >
          Hoy
        </button>
        <button
          className={`px-4 py-2 rounded ${filtro === "mes" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("mes")}
        >
          Este Mes
        </button>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-3">📋 Pacientes Registrados</h3>
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-700 border-b">
              <th className="py-2">Nombre</th>
              <th className="py-2">RUT</th>
              <th className="py-2">Sexo</th>
              <th className="py-2">Fecha Nac.</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map(p => (
              <tr key={p.id_paciente} className="border-b hover:bg-gray-50">
                <td className="py-2">{p.nombre_completo}</td>
                <td className="py-2">{p.rut}</td>
                <td className="py-2">{p.sexo}</td>
                <td className="py-2">{p.fecha_nacimiento}</td>
                <td className="py-2 flex gap-2">
                  <button
                    onClick={() => setPacienteDetalle(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => eliminarPaciente(p.id_paciente)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Ver Paciente */}
      {pacienteDetalle && (
        <ModalVerPaciente
          paciente={pacienteDetalle}
          onClose={() => setPacienteDetalle(null)}
        />
      )}
    </div>
  );
}
