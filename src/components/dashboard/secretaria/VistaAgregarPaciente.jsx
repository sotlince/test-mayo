import { useState } from "react";
import { LogOut, Users, Calendar, FileText, User, Bell, Settings, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa"; // Agregado
import { Link, useNavigate } from "react-router-dom";

export default function VistaAgregarPaciente() {
  const [formulario, setFormulario] = useState({
    nombre_completo: "",
    rut: "",
    fecha_nacimiento: "",
    sexo: "",
    telefono_contacto: "",
    tipo_discapacidad: "",
    modo_comunicacion: "",
    ayudas_tecnicas: "",
    avatar_url: "",
    requiere_asistencia: false,
    contacto_emergencia: "",
    antecedentes: "",
    sintomas: [],
  });

  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate(); // ✅ para volver

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formulario),
      });

      const data = await res.json();
      if (data.ok) {
        setMensaje("Paciente registrado correctamente ✅");
        setFormulario({
          nombre_completo: "",
          rut: "",
          fecha_nacimiento: "",
          sexo: "",
          telefono_contacto: "",
          tipo_discapacidad: "",
          modo_comunicacion: "",
          ayudas_tecnicas: "",
          avatar_url: "",
          requiere_asistencia: false,
          contacto_emergencia: "",
          antecedentes: "",
          sintomas: [],
        });
      } else {
        setMensaje("Error: " + (data.mensaje || "No se pudo registrar"));
      }
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      setMensaje("Error de conexión ❌");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ✅ Encabezado con botón de volver */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-800">Agregar Nuevo Paciente</h1>
        <button
          onClick={() => navigate("/dashboard/secretaria")} // ✅ Ajusta la ruta si es diferente
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">Nombre Completo:</label>
            <input type="text" name="nombre_completo" value={formulario.nombre_completo} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">RUT o Identificador:</label>
            <input type="text" name="rut" value={formulario.rut} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Fecha de Nacimiento:</label>
            <input type="date" name="fecha_nacimiento" value={formulario.fecha_nacimiento} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Sexo:</label>
            <select name="sexo" value={formulario.sexo} onChange={handleChange} required className="w-full p-2 border rounded">
              <option value="">Seleccione</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Teléfono de Contacto:</label>
            <input type="text" name="telefono_contacto" value={formulario.telefono_contacto} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Tipo de Discapacidad:</label>
            <input type="text" name="tipo_discapacidad" value={formulario.tipo_discapacidad} onChange={handleChange} required className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Modo de Comunicación:</label>
            <input type="text" name="modo_comunicacion" value={formulario.modo_comunicacion} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Ayudas Técnicas:</label>
            <input type="text" name="ayudas_tecnicas" value={formulario.ayudas_tecnicas} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Avatar URL:</label>
            <input type="text" name="avatar_url" value={formulario.avatar_url} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="requiere_asistencia" checked={formulario.requiere_asistencia} onChange={handleChange} />
            <label className="text-gray-700 font-semibold">¿Requiere asistencia?</label>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Contacto de Emergencia:</label>
            <input type="text" name="contacto_emergencia" value={formulario.contacto_emergencia} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Antecedentes Médicos:</label>
            <textarea name="antecedentes" value={formulario.antecedentes} onChange={handleChange} rows="3" className="w-full p-2 border rounded" />
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition">
          Registrar Paciente
        </button>

        {mensaje && <p className="text-center mt-4">{mensaje}</p>}
      </form>
    </div>
  );
}
