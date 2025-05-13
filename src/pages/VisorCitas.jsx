import { useEffect, useState } from "react";
import "./../assets/css/Visor.css";

export default function VisorCitas() {
  const [citas, setCitas] = useState([]);

  const fetchCitas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/citas/visor`);
      const data = await res.json();
  
      if (data.ok) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // desde medianoche de hoy
  
        const mañana = new Date(hoy);
        mañana.setDate(hoy.getDate() + 2); // incluye citas hasta mañana a las 23:59
  
        const citasFiltradas = data.citas.filter(cita => {
          const fechaCita = new Date(cita.fecha_inicio);
          return fechaCita >= hoy && fechaCita < mañana;
        });
  
        const citasOrdenadas = citasFiltradas.sort(
          (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
        );
  
        setCitas(citasOrdenadas);
      }
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
    }
  };
  

  useEffect(() => {
    fetchCitas();
    const interval = setInterval(fetchCitas, 5000000); // refresca cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const renderCita = (cita, index) => (
    <div
      key={index}
      className="w-full max-w-4xl bg-white rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2"
    >
      <div className="text-left">
        <p className="text-lg font-semibold">
          Paciente: {cita.paciente?.nombre_completo || "Nombre no disponible"}
        </p>
        <p className="text-sm text-gray-600">
          RUT: {cita.paciente?.rut || "XX.XXX.XXX-X"}
        </p>
        <p className="text-sm text-gray-600">
          Médico tratante:{" "}
          {cita.usuario?.nombre_completo && cita.usuario.nombre_completo.trim() !== ""
            ? cita.usuario.nombre_completo
            : "Aleatorio"}
        </p>
      </div>
      <div className="text-left md:text-right">
        <p className="text-md font-bold text-indigo-600">
          {new Date(cita.fecha_inicio).toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col justify-center items-center gap-6 px-6 py-10 font-sans">
      <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-lg mb-6">
        Citas Reservadas
      </h1>

      {citas.length === 0 ? (
        <p className="text-gray-500">No hay citas programadas para hoy.</p>
      ) : (
        citas.map((cita, index) => renderCita(cita, index))
      )}
    </div>
  );
}
