import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import esCL from "date-fns/locale/es";
import { FaArrowLeft } from "react-icons/fa";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../../src/index.css"; // Asegúrate de que tu index.css tenga estilos personalizados si quieres
import { useNavigate } from "react-router-dom";

const locales = {
  es: esCL,
};


const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date, options) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function VistaCitasAdmin() {
  const navigate = useNavigate(); // ✅ AQUÍ dentro del componente
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [vistaActual, setVistaActual] = useState("month");

  const volver = () => navigate("/dashboard/admin"); // ✅ Volver al dashboard

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/api/citas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.citas) {
          const citasFormateadas = data.citas.map(cita => ({
            title: cita.titulo || `Cita con ${cita.nombre_paciente}`,
            start: new Date(cita.fecha_inicio),
            end: new Date(cita.fecha_fin),
          }));
          setEventos(citasFormateadas);
        }
      })
      .catch(error => console.error("Error al cargar citas:", error));
  }, []);

  const handleEventoClick = (evento) => {
    setEventoSeleccionado(evento);
  };


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          📅 Gestión de Citas
        </h2>
        <button
          onClick={volver}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>
      <div className="bg-white shadow rounded-lg p-4">
        <Calendar
          localizer={localizer}
          culture="es"
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          view={vistaActual}
          onView={setVistaActual}
          views={["month", "week", "day"]}
          style={{ height: 500 }}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          onSelectEvent={handleEventoClick}
        />

        {eventoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                🗓️ {eventoSeleccionado.title}
              </h3>
              <p className="text-gray-700 mb-2">
                Inicio: {eventoSeleccionado.start.toLocaleString()}
              </p>
              <p className="text-gray-700 mb-4">
                Fin: {eventoSeleccionado.end.toLocaleString()}
              </p>
              <button
                onClick={() => setEventoSeleccionado(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
