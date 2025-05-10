import { useEffect, useState } from "react";
import perfilDefault from '../../../assets/perfil.jpg';

export default function VistaPacientesMedico() {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [pacientesPorPagina, setPacientesPorPagina] = useState(5);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [sintomas, setSintomas] = useState([]);

  const fetchPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/pacientes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        console.log("📋 Pacientes obtenidos:", data.pacientes);
        setPacientes(data.pacientes);
      }
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre_completo.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(pacientesFiltrados.length / pacientesPorPagina);
  const indiceInicial = (paginaActual - 1) * pacientesPorPagina;
  const pacientesPagina = pacientesFiltrados.slice(indiceInicial, indiceInicial + pacientesPorPagina);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handlePacientesPorPaginaChange = (e) => {
    setPacientesPorPagina(Number(e.target.value));
    setPaginaActual(1);
  };

  const abrirDetallePaciente = async (paciente) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/pacientes/${paciente.id_paciente}/completo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.ok) {
        console.log("📋 Paciente completo recibido:", data);
        setPacienteSeleccionado(data.paciente); // Paciente completo
        setSintomas(data.sintomas);              // Sus síntomas
      } else {
        console.error("Error al traer paciente completo");
      }
    } catch (error) {
      console.error("Error al cargar paciente completo:", error);
    }
  };

  const cerrarDetallePaciente = () => {
    setPacienteSeleccionado(null);
    setSintomas([]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6">👨‍⚕️ Mis Pacientes Atendidos</h2>

      {/* Buscador y Select */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="🔎 Buscar paciente por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />

        <div className="flex items-center gap-2">
          <label>Pacientes por página:</label>
          <select
            value={pacientesPorPagina}
            onChange={handlePacientesPorPaginaChange}
            className="border p-2 rounded-lg shadow-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>

      {/* Tabla de Pacientes */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto p-4">
        <table className="min-w-full">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="py-1.5 px-3 text-left">Nombre Completo</th>
              <th className="py-1.5 px-3 text-left">RUT</th>
              <th className="py-1.5 px-3 text-left">Fecha Nac.</th>
              <th className="py-1.5 px-3 text-left">Sexo</th>
              <th className="py-1.5 px-3 text-left">Tel. Contacto</th>
            </tr>
          </thead>

          <tbody>
            {pacientesPagina.map((paciente) => (
              <tr
                key={paciente.id_paciente}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => abrirDetallePaciente(paciente)}
              >
                <td className="py-1.5 px-3">{paciente.nombre_completo}</td>
                <td className="py-1.5 px-3"><span className="text-sm">{paciente.rut || "No disponible"}</span></td>
                <td className="py-1.5 px-3">{paciente.fecha_nacimiento || "No disponible"}</td>
                <td className="py-1.5 px-3">{paciente.sexo || "No especificado"}</td>
                <td className="py-1.5 px-3">{paciente.telefono_contacto || "No disponible"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {pacientesPagina.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No se encontraron pacientes.
          </div>
        )}
      </div>

      {/* Paginación */}
      {pacientesFiltrados.length > pacientesPorPagina && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            disabled={paginaActual === 1}
          >
            ⬅️ Anterior
          </button>

          <span className="text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            disabled={paginaActual === totalPaginas}
          >
            Siguiente ➡️
          </button>
        </div>
      )}

      {/* Modal Detalle de Paciente */}
      {pacienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative">
            <button onClick={cerrarDetallePaciente} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              ❌
            </button>

            {/* Avatar e Información Básica */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={perfilDefault}
                alt="Avatar del paciente"
                className="w-24 h-24 rounded-full object-cover shadow"
              />

              <div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-2">
                  {pacienteSeleccionado.nombre_completo}
                </h3>
                <p><strong>RUT:</strong> {pacienteSeleccionado.rut}</p>
                <p><strong>Fecha de Nacimiento:</strong> {pacienteSeleccionado.fecha_nacimiento}</p>
                <p><strong>Sexo:</strong> {pacienteSeleccionado.sexo}</p>
                <p><strong>Teléfono:</strong> {pacienteSeleccionado.telefono_contacto}</p>
              </div>
            </div>

            {/* Información Médica */}
            <div className="mt-6 space-y-2">
              <p><strong>Tipo de Discapacidad:</strong> {pacienteSeleccionado.tipo_discapacidad}</p>
              <p><strong>Modo de Comunicación:</strong> {pacienteSeleccionado.modo_comunicacion}</p>
              <p><strong>Ayudas Técnicas:</strong> {pacienteSeleccionado.ayudas_tecnicas?.join(", ") || "Ninguna"}</p>
              <p><strong>Requiere Asistencia:</strong> {pacienteSeleccionado.requiere_asistencia ? "Sí" : "No"}</p>
              <p><strong>Antecedentes Médicos:</strong> {pacienteSeleccionado.antecedentes?.join(", ") || "Sin antecedentes"}</p>

              {/* Contacto de emergencia */}
              <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">📞 Contacto de Emergencia:</h4>
                {pacienteSeleccionado.contacto_emergencia ? (
                  <div>
                    <p><strong>Nombre:</strong> {pacienteSeleccionado.contacto_emergencia.nombre}</p>
                    <p><strong>Teléfono:</strong> {pacienteSeleccionado.contacto_emergencia.telefono}</p>
                    <p><strong>Parentesco:</strong> {pacienteSeleccionado.contacto_emergencia.parentesco}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No registrado.</p>
                )}
              </div>
            </div>

            {/* Síntomas */}
            <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-emerald-600 text-white">
          <tr>
            <th className="px-4 py-2">Zona del Cuerpo</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Gravedad</th>
          </tr>
        </thead>
        <tbody>
          {sintomas.map((sintoma, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors duration-300">

              <td className="border px-4 py-2">{sintoma.zona_cuerpo}</td>
              <td className="border px-4 py-2">{sintoma.descripcion}</td>
              <td className="border px-4 py-2 text-center">{sintoma.gravedad}/10</td>
            </tr>
          ))}
        </tbody>
      </table>

          </div>
        </div>
      )}
    </div>
  );
}
