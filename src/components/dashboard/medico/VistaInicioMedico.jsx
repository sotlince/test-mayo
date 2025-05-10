import { useOutletContext, Link } from "react-router-dom";
import { FaUserInjured, FaCheckCircle, FaStethoscope } from "react-icons/fa";

export default function VistaInicioMedico() {
  const { usuario } = useOutletContext() || {};
  console.log("👨‍⚕️ VistaInicioMedico renderizado con usuario:", usuario);

  return (
    <div className="p-6">
      {/* 👋 Bienvenida */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8 border-l-4 border-blue-500">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          ¡Hola Dr(a). {usuario?.nombre || "Nombre no disponible"}! 👨‍⚕️
        </h1>
        <p className="text-gray-600">
          Bienvenido al módulo médico. Desde aquí podrás gestionar tus citas, pacientes y reportes de atención.
        </p>
      </div>

      {/* 📋 Tarjetas de navegación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta: Ver Citas */}
        <Link to="/dashboard/medico/citas" className="bg-white hover:bg-blue-50 transition shadow-md rounded-xl p-6 border-l-4 border-blue-500 block">
          <FaUserInjured className="text-blue-500 text-3xl mb-2" />
          <h3 className="text-lg font-semibold">📅 Ver Citas</h3>
          <p className="text-gray-500">Accede a tu agenda de pacientes.</p>
        </Link>

        {/* Tarjeta: Ver Pacientes */}
        <Link to="/dashboard/medico/pacientes" className="bg-white hover:bg-emerald-50 transition shadow-md rounded-xl p-6 border-l-4 border-emerald-500 block">
          <FaStethoscope className="text-emerald-500 text-3xl mb-2" />
          <h3 className="text-lg font-semibold">🧾 Ver Pacientes</h3>
          <p className="text-gray-500">Consulta los historiales médicos.</p>
        </Link>

        {/* Tarjeta: Ver Reportes */}
        <Link to="/dashboard/medico/reportes" className="bg-white hover:bg-cyan-50 transition shadow-md rounded-xl p-6 border-l-4 border-cyan-500 block">
          <FaCheckCircle className="text-cyan-500 text-3xl mb-2" />
          <h3 className="text-lg font-semibold">📊 Ver Reportes</h3>
          <p className="text-gray-500">Revisa tus estadísticas de atención.</p>
        </Link>

      </div>
    </div>
  );
}
