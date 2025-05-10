import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FaUserFriends, FaCalendarCheck, FaClipboardList, FaBell } from "react-icons/fa";

export default function VistaDashboardSecretaria() {
  const { usuario } = useOutletContext() || {};

  const [totalPacientes, setTotalPacientes] = useState(0);
  const [citasHoy, setCitasHoy] = useState(0);
  const [llamadosPendientes, setLlamadosPendientes] = useState(0);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    // Pacientes
    fetch("http://localhost:4000/api/pacientes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setTotalPacientes(data.pacientes.length);
      });
  
    // Citas del día
    fetch("http://localhost:4000/api/citas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const hoy = new Date().toISOString().split("T")[0];
          const citasDeHoy = data.citas.filter(c => c.fecha?.startsWith(hoy));
          setCitasHoy(citasDeHoy.length);
        }
      });
  
    // Llamados pendientes
    fetch("http://localhost:4000/api/llamados/ordenados", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) setLlamadosPendientes(data.llamados.length);
      });
  }, []);
  


  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border-l-4 border-pink-500">
        <h1 className="text-3xl font-bold text-pink-700 mb-2">
          ¡Hola {usuario?.nombre || "Secretaria"}! 👋
        </h1>
        <p className="text-gray-600">
          Bienvenida al panel de gestión. Desde aquí puedes revisar citas, visualizar pacientes y apoyar en la administración diaria.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-pink-500">
    <FaUserFriends className="text-pink-500 text-3xl mb-2" />
    <h3 className="text-lg font-semibold">Pacientes registrados</h3>
    <p className="text-gray-500">Total: {totalPacientes}</p>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-purple-500">
    <FaCalendarCheck className="text-purple-500 text-3xl mb-2" />
    <h3 className="text-lg font-semibold">Citas programadas</h3>
    <p className="text-gray-500">Hoy: {citasHoy}</p>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-yellow-500">
    <FaBell className="text-yellow-500 text-3xl mb-2" />
    <h3 className="text-lg font-semibold">Llamados pendientes</h3>
    <p className="text-gray-500">Pendientes: {llamadosPendientes}</p>
  </div>

  <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-cyan-500">
    <FaClipboardList className="text-cyan-500 text-3xl mb-2" />
    <h3 className="text-lg font-semibold">Tareas pendientes</h3>
    <p className="text-gray-500">Revisar: 4</p> {/* Puedes reemplazar esto más adelante */}
  </div>
</div>
        
      </div>

  );
}

