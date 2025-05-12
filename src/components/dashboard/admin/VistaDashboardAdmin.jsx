import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaFileAlt, FaUserMd } from "react-icons/fa";

export default function VistaDashboardAdmin() {
  const navigate = useNavigate();
  const { usuario } = useOutletContext() || {};

  const [usuarios, setUsuarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json())
      .then(data => { if (data.ok) setUsuarios(data.usuarios); });

    fetch(`${import.meta.env.VITE_API_URL}/api/pacientes`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json())
      .then(data => { if (data.ok) setPacientes(data.pacientes); });

    fetch(`${import.meta.env.VITE_API_URL}/api/citas`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json())
      .then(data => { if (data.ok) setCitas(data.citas); });

    fetch(`${import.meta.env.VITE_API_URL}/api/pacientes`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json())
      .then(data => { if (data.ok) setReportes(data.pacientes); });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-900 mb-2">
        ¡Hola {usuario?.nombre || "Administrador"}! 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Bienvenido al panel de administración. Desde aquí puedes gestionar usuarios, pacientes, citas y reportes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Card
          icon={<FaUser className="text-indigo-500 text-3xl" />}
          titulo="Usuarios Registrados"
          cantidad={usuarios.length}
          color="border-indigo-500"
          ruta="/dashboard/admin/edit_usuarios"
          navigate={navigate}
        />

        <Card
          icon={<FaUserMd className="text-blue-400 text-3xl" />}
          titulo="Pacientes Registrados"
          cantidad={pacientes.length}
          color="border-blue-400"
          ruta="/dashboard/admin/pacientes_admin"
          navigate={navigate}
        />

        <Card
          icon={<FaCalendarAlt className="text-green-500 text-3xl" />}
          titulo="Citas Programadas"
          cantidad={citas.length}
          color="border-green-500"
          ruta="/dashboard/admin/citas"
          navigate={navigate}
        />

        <Card
          icon={<FaFileAlt className="text-pink-500 text-3xl" />}
          titulo="Reportes Generados"
          cantidad={reportes.length}
          color="border-pink-500"
          ruta="/dashboard/admin/reportes_admin"
          navigate={navigate}
        />

      </div>
    </div>
  );
}

function Card({ icon, titulo, cantidad, color, ruta, navigate }) {
  return (
    <div
      onClick={() => navigate(ruta)}
      className={`cursor-pointer bg-white shadow-md rounded-xl p-6 border-l-4 ${color} hover:shadow-lg transition-transform hover:scale-[1.02]`}
    >
      {icon}
      <h3 className="text-lg font-semibold mt-2">{titulo}</h3>
      <p className="text-gray-500">Total: {cantidad}</p>
    </div>
  );
}
