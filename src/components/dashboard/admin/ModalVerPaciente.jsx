import { FaTimes } from "react-icons/fa";

export default function ModalVerPaciente({ paciente, onClose }) {
  if (!paciente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
          📋 Detalles del Paciente
        </h2>

        <div className="space-y-3 text-sm">
          <p><strong>👤 Nombre:</strong> {paciente.nombre_completo}</p>
          <p><strong>🆔 RUT:</strong> {paciente.rut}</p>
          <p><strong>🎂 Fecha Nacimiento:</strong> {paciente.fecha_nacimiento}</p>
          <p><strong>⚥ Sexo:</strong> {paciente.sexo}</p>
          <p><strong>📞 Teléfono:</strong> {paciente.telefono_contacto || "No disponible"}</p>
        </div>
      </div>
    </div>
  );
}
