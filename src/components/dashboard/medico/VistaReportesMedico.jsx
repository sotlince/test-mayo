import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalReportePaciente from "./ModalReportePaciente";

export default function VistaReportesMedico() {
  const navigate = useNavigate();
  const [dataReporte, setDataReporte] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const volver = () => navigate("/dashboard/medico");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        setDataReporte(data.pacientes);
      }
    } catch (error) {
      console.error("Error al cargar datos del reporte:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const abrirModalReporte = async (item) => {
    try {
      const token = localStorage.getItem("token");
  
      // 🔥 Siempre cargar el paciente COMPLETO desde la BD
      const res = await fetch(`http://localhost:4000/api/pacientes/${item.id_paciente}/completo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      if (data.ok) {
        setPacienteSeleccionado({
            ...data.paciente,
            sintomas: data.sintomas || []  // 👈 aquí le embebes los síntomas al paciente
          });
      } else {
        console.error("Error al cargar paciente completo.");
      }
    } catch (error) {
      console.error("Error en abrirModalReporte:", error);
    }
  };


  const cerrarModalReporte = () => {
    setPacienteSeleccionado(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-emerald-700 mb-6">📄 Reportes de Pacientes</h2>

      {/* Botón Volver */}
      <div className="mb-8">
        <button
          onClick={volver}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow transition"
        >
          ⬅️ Volver
        </button>
      </div>

      {/* Tabla de reportes */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">RUT</th>
              <th className="px-4 py-2">Nacimiento</th>
              <th className="px-4 py-2">Sexo</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {dataReporte.map((paciente, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-4 py-2">{paciente.nombre_completo}</td>
                <td className="px-4 py-2">{paciente.rut}</td>
                <td className="px-4 py-2">{paciente.fecha_nacimiento}</td>
                <td className="px-4 py-2">{paciente.sexo}</td>
                <td className="px-4 py-2">{paciente.telefono_contacto}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => abrirModalReporte(paciente)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {dataReporte.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No hay pacientes registrados.
          </div>
        )}
      </div>

      {/* Modal Reporte */}
      {pacienteSeleccionado && (
        <ModalReportePaciente paciente={pacienteSeleccionado} onClose={cerrarModalReporte} />
      )}
    </div>
  );
}
