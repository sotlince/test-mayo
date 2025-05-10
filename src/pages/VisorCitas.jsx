import { useEffect, useState } from "react";
import "./../assets/css/Visor.css";

export default function VisorCitas() {
  const [citas, setCitas] = useState([]);

  const fetchCitas = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/citas/visor");
      const data = await res.json();

      if (data.ok) {
        const citasOrdenadas = data.citas.sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );
        setCitas(citasOrdenadas);
      }
    } catch (error) {
      console.error("❌ Error cargando citas:", error);
    }
  };

  useEffect(() => {
    fetchCitas();
    const interval = setInterval(fetchCitas, 5000); // refresca cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const renderCita = (cita, index) => (
    <div
      key={index}
      className="w-full max-w-4xl bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <div>
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
      <div className="text-right">
        <p className="text-md font-bold text-indigo-600">
          {new Date(cita.fecha).toLocaleString("es-CL", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col justify-center items-center gap-6 px-6 py-10 font-sans">
      
      {/* Título principal */}
      <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-lg mb-6">
        Citas Reservadas
      </h1>

      {/* Lista de citas */}
      {citas.length === 0 ? (
        <p className="text-gray-500">No hay citas programadas.</p>
      ) : (
        citas.map((cita, index) => renderCita(cita, index))
      )}
    </div>
  );
}
