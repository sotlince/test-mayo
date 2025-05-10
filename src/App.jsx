import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RutaProtegida from "./components/RutaProtegida";
// import TestCalendar from "./pages/TestCalendar";
import TestCalendar from "./pages/TestCalendar";
//import formulario from "./components/formulario/Formulario";
import LayoutFormulario from "./components/formulario/Layout";

import DatosBasicos from "./components/formulario/pasos/DatosBasicos";
import InformacionMedica from "./components/formulario/pasos/InformacionMedica";

// Visor
import Visor from "./pages/Visor";
import VisorCitas from "./pages/VisorCitas";
import VistaPerfilUsuario from "./components/dashboard/VistaPerfilUsuario";


// Dashboards por rol
import DashboardAdmin from "./components/dashboard/admin/DashboardAdmin";
import DashboardSecretaria from "./components/dashboard/secretaria/DashboardSecretaria";
import DashboardMedico from "./components/dashboard/medico/DashboardMedico";
// Vistas de Admnistrador
import VistaPacientesAdmin from "./components/dashboard/admin/VistaPacientesAdmin";
import VistaCitasAdmin from "./components/dashboard/admin/VistaCitasAdmin";
import VistaReportesAdmin from "./components/dashboard/admin/VistaReportesAdmin";
import VistaLlamadosAdmin from "./components/dashboard/admin/VistaLlamadosAdmin";
import VistaEditUsuarios from "./components/dashboard/admin/VistaEditUsuarios";
import VistaDashboardAdmin from "./components/dashboard/admin/VistaDashboardAdmin";
//import VistaConfiguracionAdmin from "./components/dashboard/admin/VistaConfiguracionAdmin";

// Vistas internas Secretaria
import VistaUsuarios from "./components/dashboard/admin/VistaDashboardAdmin";
import VistaCitasSecretaria from "./components/dashboard/secretaria/VistaCitasSecretaria";
import VistaLlamadosSecretaria from "./components/dashboard/secretaria/VistaLlamadosSecretaria";
import VistaCitas from "./components/dashboard/secretaria/VistaCitas";
import VistaPacientesSecretaria from "./components/dashboard/secretaria/VistaPacientesSecretaria";
import VistaAgregarPaciente from "./components/dashboard/secretaria/VistaAgregarPaciente"; // Nueva opción
//Medicos
import VistaIniciosMedico from "./components/dashboard/medico/VistaInicioMedico";
import VistaPacientesMedico from "./components/dashboard/medico/VistaPacientesMedico";
import VistaCitasMedico from "./components/dashboard/medico/VistaCitasMedico";
import VistaReportesMedico from "./components/dashboard/medico/VistaReportesMedico";
import LocalizarDolor from "./components/formulario/pasos/LocalizarDolor";
import PuntuarDolor from "./components/formulario/pasos/PuntuarDolor";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const html = document.documentElement;
    const isFormulario = location.pathname.startsWith("/formulario/");
    if (isFormulario) {
      html.classList.add("sitio-paciente");
    } else {
      html.classList.remove("sitio-paciente");
    }
  }, [location]);
  return (
    <Routes>
      {/* ✅ Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/llamados" element={<Visor />} />
      <Route path="/citas" element={<VisorCitas />} />
      {/* ✅ Tester */}  
      <Route path="/test" element={<TestCalendar />} />

      {/* ✅ Formulario */}
      <Route path="/formulario/*">
        <Route path="datos-basicos" element={<DatosBasicos />} />
        <Route path="informacion-medica" element={<InformacionMedica />} />
        <Route path="localizar-dolor" element={<LocalizarDolor />} />
        <Route path="puntuar-dolor" element={<PuntuarDolor />} />
        <Route index element={<Navigate to="datos-basicos" />} />
      </Route>

      {/* ✅ Dashboard Administrador con su vista inicial */}
      <Route
        path="/dashboard/admin/*"
        element={
          <RutaProtegida rolesPermitidos={["Administrador"]}>
            <DashboardAdmin />
          </RutaProtegida>
        }
      >
        <Route index element={<VistaUsuarios />} />
        <Route path="pacientes_admin" element={<VistaPacientesAdmin />} />
        <Route path="citas_admin" element={<VistaCitasAdmin />} />
        <Route path="reportes_admin" element={<VistaReportesAdmin />} />
        <Route path="llamados_admin" element={<VistaLlamadosAdmin />} />
        <Route path="edit_usuarios" element={<VistaEditUsuarios />} />
        <Route path="usuarios_dashboard" element={<VistaDashboardAdmin />} />
        <Route path="perfil" element={<VistaPerfilUsuario />} /> {/* 🎉 agregado */}
        {/* Otras rutas: <Route path="reportes" element={<VistaReportes />} /> */}
      </Route>

      {/* ✅ Dashboard Secretaria con su vista inicial */}
      <Route
        path="/dashboard/secretaria/*"
        element={
          <RutaProtegida rolesPermitidos={["Secretaria"]}>
            <DashboardSecretaria />
          </RutaProtegida>
        }
      >
        <Route index element={<VistaCitasSecretaria />} />
        <Route path="llamados" element={<VistaLlamadosSecretaria />} />
        <Route path="citas" element={<VistaCitas />} />
        <Route path="pacientes" element={<VistaPacientesSecretaria />} />
        <Route path="agregar-paciente" element={<VistaAgregarPaciente />} />
        <Route path="perfil" element={<VistaPerfilUsuario />} /> {/* 🎉 agregado */}
      </Route>

      {/* ✅ Dashboard Médico con su vista inicial */}
      <Route
        path="/dashboard/medico/*"
        element={
          <RutaProtegida rolesPermitidos={["Medico"]}>
            <DashboardMedico />
          </RutaProtegida>
        }
      >
        <Route index element={<VistaIniciosMedico />} />
        <Route path="pacientes" element={<VistaPacientesMedico />} />
        <Route path="citas" element={<VistaCitasMedico />} />
        <Route path="reportes" element={<VistaReportesMedico />} />
        <Route path="perfil" element={<VistaPerfilUsuario />} /> {/* 🎉 agregado */}
      </Route>

      {/* ✅ Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
