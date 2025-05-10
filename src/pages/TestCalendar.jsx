// src/pages/TestCalendar.jsx
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

const eventos = [
  {
    title: "Evento de prueba",
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
  },
];

export default function TestCalendar() {
  return (
    <div className="min-h-screen bg-white p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🧪 Calendario de Prueba</h2>
      <Calendar
        localizer={localizer}
        culture="es"
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        style={{ height: "600px" }}
      />
    </div>
  );
}