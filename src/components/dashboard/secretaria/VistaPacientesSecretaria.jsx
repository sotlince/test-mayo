import { useEffect, useState } from "react";
import { FaUser, FaClock, FaCalendarAlt } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

export default function VistaPacientesSecretaria() {
  const { usuario } = useOutletContext();
  const [pacientes, setPacientes] = useState([]);
  const [llamados, setLlamados] = useState([]);
  const [filtro, setFiltro] = useState("hoy");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Obtener pacientes
    fetch("http://localhost:4000/api/pacientes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPacientes(data.pacientes);
        
      });

    // Obtener llamados pendientes
    fetch("http://localhost:4000/api/llamados/ordenados", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setLlamados(data.llamados);
      });
  }, []);

  const pacientesFiltrados = pacientes.filter(p => {
    const hoy = new Date().toISOString().split("T")[0];
    const fechaPaciente = p.fecha_creacion?.split("T")[0];
    if (filtro === "hoy") return fechaPaciente === hoy;
    if (filtro === "mes") return fechaPaciente?.slice(0, 7) === hoy.slice(0, 7);
    return true;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-pink-700 mb-4 flex items-center gap-2">
        <FaUser /> Gestión de Pacientes
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${filtro === "hoy" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("hoy")}
        >
          Hoy
        </button>
        <button
          className={`px-4 py-2 rounded ${filtro === "mes" ? "bg-pink-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFiltro("mes")}
        >
          Este Mes
        </button>
      </div>

      <div className="bg-white p-4 shadow rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-3">📋 Pacientes registrados</h3>
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="text-gray-700 border-b">
              <th className="py-2">Nombre</th>
              <th className="py-2">RUT</th>
              <th className="py-2">Sexo</th>
              <th className="py-2">Fecha Nac.</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pacientesFiltrados.map(p => (
              <tr key={p.id_paciente} className="border-b hover:bg-gray-50">
                <td className="py-2">{p.nombre_completo}</td>
                <td className="py-2">{p.rut}</td>
                <td className="py-2">{p.sexo}</td>
                <td className="py-2">{p.fecha_nacimiento}</td>
                <td className="py-2">
                  <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600">
                    Cambiar orden
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🔔 Llamados pendientes</h3>
        <ul className="space-y-2">
          {llamados.map((l, i) => (
            <li
              key={l.id_llamado}
              className="flex justify-between items-center p-3 border rounded hover:bg-gray-100"
            >
              <span>
                #{i + 1} | Prioridad: {l.prioridad}
              </span>
              <button className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                Reordenar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}