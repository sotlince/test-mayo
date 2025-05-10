import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../../../src/index.css";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import esCL from "date-fns/locale/es";

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

// 🔵 Demo de citas para el médico
const eventosDemo = [
  {
    title: "Revisión general - Paciente Juan Pérez",
    start: new Date(2025, 3, 25, 9, 0),
    end: new Date(2025, 3, 25, 9, 30),
  },
  {
    title: "Control post-operatorio - Ana Torres",
    start: new Date(2025, 3, 25, 11, 0),
    end: new Date(2025, 3, 25, 11, 45),
  },
];

export default function VistaCitasMedico() {
  const [eventos, setEventos] = useState(eventosDemo);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [vistaActual, setVistaActual] = useState("week");

  const handleEventoClick = (evento) => {
    setEventoSeleccionado(evento);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-cyan-700 mb-4">📋 Mis Citas Médicas</h2>

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
                🩺 {eventoSeleccionado.title}
              </h3>
              <p className="text-gray-700 mb-2">
                Inicio: {eventoSeleccionado.start.toLocaleString()}
              </p>
              <p className="text-gray-700 mb-4">
                Fin: {eventoSeleccionado.end.toLocaleString()}
              </p>
              <button
                onClick={() => setEventoSeleccionado(null)}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
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
