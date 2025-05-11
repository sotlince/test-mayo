import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import DashboardLayout from "../DashboardLayout";

export default function DashboardAdmin() {
  console.log("🔥 DashboardAdmin cargado");

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPerfil = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("📦 Admin: Respuesta completa:", data);

        if (res.ok) {
          console.log("✅ Admin: Usuario obtenido:", data.usuario);
          setUsuario(data.usuario);
        }
      } catch (error) {
        console.error("❌ Error al obtener perfil del admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!usuario || usuario.rol !== "Administrador")
    return <Navigate to="/login" />;

  return (
    <DashboardLayout>
      <Sidebar role={usuario.rol} />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-y-auto">
        {/* 👉 Aquí se montan las subrutas como VistaUsuarios, VistaPacientes, etc */}
        <Outlet context={{ usuario }} />
      </div>
    </DashboardLayout>
  );
}
