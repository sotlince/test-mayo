import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Users,
  Calendar,
  FileText,
  User,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserCog
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Sidebar({ role }) {
  const [abierto, setAbierto] = useState(false); // 👈 Comienza comprimido

  const toggleSidebar = () => setAbierto(!abierto);

  const itemClass =
    "flex items-center gap-3 p-2 hover:bg-indigo-700 rounded transition";

  return (
    <aside
      className={`h-screen overflow-y-auto bg-indigo-800 text-white p-4 transition-all ${
        abierto ? "w-64" : "w-20"
      }`}
    >
      {/* Header del logo + botón */}
      <div className="flex items-center justify-between mb-6">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all ${abierto ? "w-20" : "w-10 mx-auto"}`}
        />
        <button onClick={toggleSidebar} className="text-white">
          {abierto ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Menú */}
      <ul className="space-y-4">
        {/* Administrador */}
        {role === "Administrador" && (
          <>
            <li>
              <Link to="/dashboard/admin" className={itemClass}>
                <Users />
                {abierto && "Usuarios"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/pacientes_admin" className={itemClass}>
                <User />
                {abierto && "Pacientes"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/citas" className={itemClass}>
                <Calendar />
                {abierto && "Citas"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/llamados_admin" className={itemClass}>
                <Bell />
                {abierto && "Llamados"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/reportes_admin" className={itemClass}>
                <FileText />
                {abierto && "Reportes"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin/edit_usuarios" className={itemClass}>
                <Settings />
                {abierto && "Administrar Roles"}
              </Link>
            </li>
          </>
        )}

        {/* Secretaria */}
        {role === "Secretaria" && (
          <>
            <li>
              <Link to="/dashboard/secretaria/pacientes" className={itemClass}>
                <User />
                {abierto && "Pacientes"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/secretaria/citas" className={itemClass}>
                <Calendar />
                {abierto && "Citas"}
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/secretaria/agregar-paciente"
                className={itemClass}
              >
                <Plus />
                {abierto && "Agregar Paciente"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/secretaria/llamados" className={itemClass}>
                <Bell />
                {abierto && "Llamados"}
              </Link>
            </li>
            <li>
      <Link to="/dashboard/secretaria/perfil" className={itemClass}>
        <UserCog />
        {abierto && "Editar Perfil"}
      </Link>
    </li>
          </>
        )}

        {/* Médico */}
        {role === "Medico" && (
          <>
            <li>
              <Link to="/dashboard/medico/citas" className={itemClass}>
                <Calendar />
                {abierto && "Mis Citas"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/medico/pacientes" className={itemClass}>
                <User />
                {abierto && "Pacientes"}
              </Link>
            </li>
            <li>
              <Link to="/dashboard/medico/reportes" className={itemClass}>
                <FileText />
                {abierto && "Reportes"}
              </Link>
            </li>
            <li>
            <Link to="/dashboard/medico/perfil" className={itemClass}>
        <UserCog />
        {abierto && "Editar Perfil"}
      </Link>
    </li>
          </>
        )}

        {/* Cerrar sesión */}
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className={`${itemClass} text-red-300 hover:text-white`}
          >
            <LogOut /> {abierto && "Cerrar sesión"}
          </button>
        </li>
      </ul>
    </aside>
  );
}
