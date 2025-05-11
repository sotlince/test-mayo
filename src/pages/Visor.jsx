import { useEffect, useState } from "react";
import "./../assets/css/Visor.css";

export default function Visor() {
  const [llamadoActual, setLlamadoActual] = useState(null);
  const [ultimosAtendidos, setUltimosAtendidos] = useState([]);
  const [proximosPendientes, setProximosPendientes] = useState([]);

  const placeholders = [
    { nombre: "XXXXXX XXXXXXX", rut: "XX.XXX.XXX-X" },
    { nombre: "XXXXXX XXXXXXX", rut: "XX.XXX.XXX-X" },
  ];

  const fetchDatos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/llamados/dashboard`);
      const data = await res.json();

      if (data.ok) {
        // 🔵 Llamado actual
        setLlamadoActual(data.llamadosActivos[0] || null);

        // ✅ Últimos atendidos (máximo 2)
        const atendidosFormateados = data.ultimosAtendidos.slice(0, 2).map(p => ({
          nombre: p.paciente?.nombre_completo || "XXXXXX XXXXXXX",
          rut: p.paciente?.rut || "XX.XXX.XXX-X",
        }));
        setUltimosAtendidos(atendidosFormateados);

        // 📋 Próximos pendientes (máximo 2)
        const pendientesFormateados = data.pendientes.slice(0, 2).map(p => ({
          nombre: p.paciente?.nombre_completo || "XXXXXX XXXXXXX",
          rut: p.paciente?.rut || "XX.XXX.XXX-X",
        }));
        setProximosPendientes(pendientesFormateados);
      }
    } catch (error) {
      console.error("❌ Error cargando visor:", error);
    }
  };

  useEffect(() => {
    fetchDatos();
    const interval = setInterval(fetchDatos, 50000000000000000000000000000000000000000000000000000); // refresca cada 5 segundos
    return () => clearInterval(interval); // limpia al desmontar
  }, []);

  const renderPaciente = (p, extraClasses = "") => (
    <div className={`paciente-card ${extraClasses}`}>
      {p?.nombre} <span className="mx-2">|</span> {p?.rut}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col justify-center items-center gap-6 px-6 py-10 font-sans">
      
      {/* Título Urgencias */}
      <h1 className="text-5xl font-extrabold text-red-600 drop-shadow-lg mb-6">
        URGENCIAS
      </h1>

      {/* Últimos atendidos */}
      {[...ultimosAtendidos, ...placeholders].slice(0, 2).map((p, i) => (
        <div key={`atendido-${i}`} className="w-full max-w-3xl">
          {renderPaciente(p)}
        </div>
      ))}

      {/* Llamado actual */}
      <div className="w-full max-w-6xl">
        <div className="paciente-llamado animate-call-blink text-6xl font-bold p-12 text-center rounded-2xl shadow-2xl">
          {(llamadoActual?.paciente?.nombre_completo || "XXXXXX XXXXXXX")}
          <span className="mx-4">|</span>
          {(llamadoActual?.paciente?.rut || "XX.XXX.XXX-X")}
        </div>
      </div>

      {/* Próximos pendientes */}
      {[...proximosPendientes, ...placeholders].slice(0, 2).map((p, i) => (
        <div key={`pendiente-${i}`} className="w-full max-w-3xl">
          {renderPaciente(p)}
        </div>
      ))}

    </div>
  );
}
