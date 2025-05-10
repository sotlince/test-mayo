import { useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

export default function ModalReportePaciente({ paciente, onClose }) {
  const [observaciones, setObservaciones] = useState("");

  const historialMock = [
    { fecha: "2024-04-01", descripcion: "Consulta general", medico: "Dr. Juan Pérez" },
    { fecha: "2024-05-15", descripcion: "Control de síntomas", medico: "Dra. Ana Torres" },
  ];

  const examenesMock = [
    { fecha: "2024-03-10", tipo: "Radiografía de Tórax", resultado: "Normal" },
    { fecha: "2024-06-20", tipo: "Análisis de Sangre", resultado: "Leve Anemia" },
  ];

  const generarPDF = async () => {
    const input = document.getElementById("reporte-paciente");
    if (!input) {
      console.error("No se encontró el div reporte-paciente");
      return;
    }
  
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        backgroundColor: "#ffffff", // Fondo blanco para mejor impresión
        useCORS: true,
      });
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
  
      pdf.save(`reporte-${paciente.nombre_completo}.pdf`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
    }
  }; 
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      
      {/* Modal visible para el usuario */}
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl shadow-lg relative max-h-[90vh] overflow-y-auto">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ❌
        </button>

        {/* Contenido del modal visible */}
        <ContenidoPaciente paciente={paciente} historialMock={historialMock} examenesMock={examenesMock} observaciones={observaciones} setObservaciones={setObservaciones} />

        {/* Botón para generar PDF */}
        <div className="mt-8 text-center">
          <button
            onClick={generarPDF}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow"
          >
            📄 Generar PDF
          </button>
        </div>

      </div>

      {/* Div oculto para capturar el PDF completo */}
      <div style={{
      position: "absolute",
      top: "-9999px",
      left: "-9999px",
      opacity: 0,
      pointerEvents: "none"
    }}>
      <div id="reporte-paciente" className="p-8 w-[800px]">
        <ContenidoPaciente 
          paciente={paciente} 
          historialMock={historialMock} 
          examenesMock={examenesMock} 
          observaciones={observaciones}
          setObservaciones={setObservaciones}  
        />
      </div>
    </div>

    </div>
  );
}

function ContenidoPaciente({ paciente, historialMock, examenesMock, observaciones, setObservaciones }) {
  return (
    <>
{/* Datos Personales */}
<div className="mt-4">
  <h3 className="text-lg font-semibold text-emerald-700 mb-4">🧍 Datos Personales</h3>
  <table className="min-w-full border border-gray-300 text-sm mb-6">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-4 py-2">👤 Nombre</th>
        <th className="border px-4 py-2">🆔 RUT</th>
        <th className="border px-4 py-2">🎂 Nacimiento</th>
        <th className="border px-4 py-2">⚥ Sexo</th>
        <th className="border px-4 py-2">📞 Teléfono</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">{paciente.nombre_completo}</td>
        <td className="border px-4 py-2">{paciente.rut}</td>
        <td className="border px-4 py-2">{paciente.fecha_nacimiento}</td>
        <td className="border px-4 py-2">{paciente.sexo}</td>
        <td className="border px-4 py-2">{paciente.telefono_contacto}</td>
      </tr>
    </tbody>
  </table>
</div>

{/* Condición Médica */}
<div className="mt-8">
  <h3 className="text-lg font-semibold text-emerald-700 mb-4">🏥 Condición Médica</h3>
  <table className="min-w-full border border-gray-300 text-sm mb-6">
    <thead className="bg-gray-100">
      <tr>
        <th className="border px-4 py-2">🦽 Discapacidad</th>
        <th className="border px-4 py-2">🗣️ Comunicación</th>
        <th className="border px-4 py-2">🛠️ Ayudas Técnicas</th>
        <th className="border px-4 py-2">🆘 Asistencia</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="border px-4 py-2">{paciente.tipo_discapacidad}</td>
        <td className="border px-4 py-2">{paciente.modo_comunicacion}</td>
        <td className="border px-4 py-2">{paciente.ayudas_tecnicas?.join(", ") || "Ninguna"}</td>
        <td className="border px-4 py-2">{paciente.requiere_asistencia ? "Sí" : "No"}</td>
      </tr>
    </tbody>
  </table>
</div>

      {/* Síntomas */}
      <h3 className="text-lg font-semibold text-emerald-700 mb-4">🧍 Síntomas</h3>
      {paciente.sintomas && paciente.sintomas.length > 0 && (
        <table className="min-w-full border border-gray-300 text-sm mb-6">            
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-2">Zona</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Gravedad</th>
            </tr>
          </thead>
          <tbody>
            {paciente.sintomas.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.zona_cuerpo}</td>
                <td className="border px-4 py-2">{item.descripcion}</td>
                <td className="border px-4 py-2 text-center">{item.gravedad}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Historial */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">🏥 Historial Médico</h3>
        <table className="min-w-full border border-gray-300 text-sm mb-6">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Médico</th>
            </tr>
          </thead>
          <tbody>
            {historialMock.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.fecha}</td>
                <td className="border px-4 py-2">{item.descripcion}</td>
                <td className="border px-4 py-2">{item.medico}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Exámenes */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">🧪 Exámenes Realizados</h3>
        <table className="min-w-full border border-gray-300 text-sm mb-6">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {examenesMock.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.fecha}</td>
                <td className="border px-4 py-2">{item.tipo}</td>
                <td className="border px-4 py-2">{item.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observaciones */}
      {setObservaciones && (
        <div className="mt-8">
        <h3 className="text-lg font-semibold text-emerald-700 mb-4">📝 Observaciones del Médico</h3>
      
        {setObservaciones ? (
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Escribe aquí observaciones clínicas, evolución, recomendaciones, etc."
            className="w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none focus:ring focus:border-emerald-400"
            rows={2}
          />
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 text-gray-600 shadow-sm bg-gray-50">
            {observaciones || "Sin observaciones registradas."}
          </div>
        )}
      </div>
      )}
    </>
  );
}
