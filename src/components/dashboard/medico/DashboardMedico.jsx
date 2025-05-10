import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import DashboardLayout from "../DashboardLayout";

export default function DashboardMedico() {
  console.log("🔥 DashboardMedico cargado");
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
        const res = await fetch("http://localhost:4000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("📦 Respuesta completa:", data); // ✔️ Aquí sí puedes acceder a data

        if (res.ok) {
          console.log("✅ Usuario obtenido:", data.usuario); // Aquí verificas si usuario viene bien
          setUsuario(data.usuario);
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!usuario || usuario.rol !== "Medico") return <Navigate to="/login" />;
  // return <div>Hola soy DashboardMedico</div>;
  return (
    <DashboardLayout>
      <Sidebar role={usuario.rol} />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen overflow-y-auto">
        {/* 👉 Aquí se monta VistaCitasMedico */}
        <Outlet context={{ usuario }} />
      </div>
    </DashboardLayout>
  );
}
