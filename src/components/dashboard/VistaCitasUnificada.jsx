import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useRef, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import esCL from "date-fns/locale/es";
import { fetcher } from "../../services/fetcher";
import Modal from "../../components/Modal";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const locales = { es: esCL };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date, options) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const hoy = dayjs();

export default function VistaCitasUnificada() {
  const navigate = useNavigate();
  const [rol, setRol] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [vistaActual, setVistaActual] = useState("month");
  const [fecha, setFecha] = useState(hoy);
  const [nuevaCita, setNuevaCita] = useState(false);
  const tipoCitaRef = useRef();
  const [paciente, setPaciente] = useState(null);
  const duracionRef = useRef();
  const motivoRef = useRef();
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRol(decoded.rol);
    }
  }, []);

  useEffect(() => {
    fetcher.get("pacientes").then((res) => {
      if (res.ok) {
        setPacientes(res.pacientes.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo)));
      }
    });
  }, []);

  useEffect(() => {
    fetcher.get("citas").then((res) => {
      if (res.ok) {
        const citasFormateadas = res.citas.map((cita) => ({
          title: pacientes.find(p => p.id_paciente === cita.id_paciente)?.nombre_completo || "Sin nombre",
          start: new Date(cita.fecha_inicio),
          end: new Date(cita.fecha_fin),
        }));
        setEventos(citasFormateadas);
      }
    });
  }, [pacientes]);

  const crearCita = (slotInfo) => {
    if ((rol === "Administrador" || rol === "Secretaria") && slotInfo.action === "doubleClick") {
      setNuevaCita(true);
      setFecha(dayjs(slotInfo.start));
    }
  };

  const guardarCita = async () => {
    if (!paciente) {
      alert("Selecciona un paciente antes de continuar.");
      return;
    }
  
    const duracion = parseInt(duracionRef.current.value);
    const cita = {
      id_paciente: paciente.id_paciente,
      fecha_inicio: fecha.toDate(),
      fecha_fin: new Date(fecha.toDate().getTime() + duracion * 60 * 1000),
      motivo: motivoRef.current.value,
      tipo_cita: tipoCitaRef.current.value,
    };
  
    try {
      await fetcher.post("citas", cita);
      setEventos([
        ...eventos,
        {
          title: paciente.nombre_completo,
          start: cita.fecha_inicio,
          end: cita.fecha_fin,
        },
      ]);
      setNuevaCita(false);
      setPaciente(null);
      setFecha(hoy);
      tipoCitaRef.current.value = "";
      motivoRef.current.value = "";
  
      setMensajeExito("✅ Cita creada exitosamente");
      setTimeout(() => setMensajeExito(""), 4000); // Oculta mensaje tras 3 segundos
    } catch (error) {
      console.error("Error al crear cita:", error);
      setMensajeExito("❌ Error al crear la cita");
      setTimeout(() => setMensajeExito(""), 4000);
    }
  };
  

  const handleVolver = () => {
    if (rol === "Administrador") navigate("/dashboard/admin");
    else if (rol === "Secretaria") navigate("/dashboard/secretaria");
    else if (rol === "Medico") navigate("/dashboard/medico");
    else navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-700">📅 Gestión de Citas</h2>
        <button onClick={handleVolver} className="bg-purple-600 text-white px-4 py-2 rounded">Volver</button>
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
          date={fecha.toDate()}
          onSelectEvent={(e) => setEventoSeleccionado(e)}
          onDrillDown={(d) => { setFecha(dayjs(d)); setVistaActual("day") }}
          onSelectSlot={crearCita}
          selectable={rol === "Administrador" || rol === "Secretaria"}
        />

        <Modal title={`🗓️ ${eventoSeleccionado?.title}`} isOpen={!!eventoSeleccionado} onClose={() => setEventoSeleccionado(null)}>
          <p className="text-gray-700 mb-2">Inicio: {eventoSeleccionado?.start.toLocaleString()}</p>
          <p className="text-gray-700 mb-4">Fin: {eventoSeleccionado?.end.toLocaleString()}</p>
        </Modal>

        <Modal title="Crear cita" isOpen={nuevaCita} onClose={() => setNuevaCita(false)} onSave={guardarCita} saveLabel="Crear">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form className="space-y-4">
              <DateTimePicker label="Fecha y hora" value={fecha} onChange={setFecha} />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de cita</InputLabel>
                <Select defaultValue="Consulta" inputRef={tipoCitaRef} label="Tipo de cita">
                  <MenuItem value="Consulta">Consulta</MenuItem>
                  <MenuItem value="Urgencia">Urgencia</MenuItem>
                </Select>
              </FormControl>

              <Autocomplete
  options={pacientes}
  value={paciente}
  onChange={(e, newVal) => setPaciente(newVal)}
  getOptionLabel={(option) => `${option.nombre_completo} (${option.rut})`}
  renderOption={(props, option) => (
    <li {...props} key={option.id_paciente}>
      {option.nombre_completo} ({option.rut})
    </li>
  )}
  renderInput={(params) => <TextField {...params} label="Paciente" />}
/>

              <TextField label="Motivo" fullWidth inputRef={motivoRef} multiline rows={2} />
              <TextField label="Duración (minutos)" type="number" defaultValue={30} inputRef={duracionRef} fullWidth />
            </form>
          </LocalizationProvider>
        </Modal>
      </div>
      {mensajeExito && (
      <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
        {mensajeExito}
      </div>
    )}
    </div>
  );
}
