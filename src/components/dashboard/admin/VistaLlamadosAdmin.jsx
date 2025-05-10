import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function VistaLlamadosAdmin() {
  const { usuario } = useOutletContext();
  const navigate = useNavigate();
  const [llamadosDashboard, setLlamadosDashboard] = useState({ activos: [], pendientes: [], atendidos: [] });
  const [modal, setModal] = useState({ abierto: false, id: null, accion: "", nombre: "" });
  const sensores = useSensors(useSensor(PointerSensor));

  const fetchLlamadosDashboard = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/llamados/dashboard");
      const data = await res.json();
      if (data.ok) {
        setLlamadosDashboard({
          activos: data.llamadosActivos,
          pendientes: data.pendientes,
          atendidos: data.ultimosAtendidos,
        });
      }
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    }
  };

  const confirmarCambioEstado = (id, accion, nombre) => {
    console.log("🔥 PASO 1: Abrir modal con", { id, accion, nombre });
    setModal({ abierto: true, id, accion, nombre });
  };

  const ejecutarCambioEstado = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/llamados/${modal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: modal.accion }),
      });
      const data = await res.json();
      console.log("✅ Cambio exitoso:", data);
      setModal({ abierto: false, id: null, accion: "", nombre: "" });
      console.log("🛑 DEBUG modal.id:", modal.id);
console.log("🛑 DEBUG modal.accion:", modal.accion);
      fetchLlamadosDashboard();
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = llamadosDashboard.pendientes.findIndex(p => p.id_llamado.toString() === active.id);
    const newIndex = llamadosDashboard.pendientes.findIndex(p => p.id_llamado.toString() === over.id);

    const nuevosOrden = arrayMove(llamadosDashboard.pendientes, oldIndex, newIndex);
    setLlamadosDashboard(prev => ({ ...prev, pendientes: nuevosOrden }));

    try {
      const token = localStorage.getItem("token");
      for (let i = 0; i < nuevosOrden.length; i++) {
        const llamado = nuevosOrden[i];
        
        await fetch(`http://localhost:4000/api/llamados/orden/${llamado.id_llamado}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orden_manual: i + 1 }),
        });
      }
      console.log("✅ Orden actualizado correctamente");
      fetchLlamadosDashboard();
    } catch (error) {
      console.error("❌ Error actualizando el orden:", error);
    }
  };

  useEffect(() => {
    fetchLlamadosDashboard();
  }, []);

  useEffect(() => {
    console.log("🌟 Modal actualizado:", modal);
  }, [modal]);

  return (
    <div className="p-6 space-y-10">

      {modal.abierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold">¿Confirmar acción?</h3>
            <p>¿Estás seguro que quieres cambiar el estado de <strong>{modal.nombre}</strong> a <strong>{modal.accion}</strong>?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setModal({ abierto: false, id: null, accion: "", nombre: "" })} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancelar</button>
              <button onClick={ejecutarCambioEstado} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => navigate("/dashboard/admin")} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow">
          <FaArrowLeft /> Volver
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">🔵 Llamado Activo</h2>
      {llamadosDashboard.activos.length === 0 ? <p>No hay pacientes siendo llamados.</p> : (
        <div className="bg-blue-100 rounded-xl shadow p-4 border-l-4 border-blue-700">
          <p className="text-lg font-semibold text-blue-900">{llamadosDashboard.activos[0].paciente?.nombre_completo}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">📋 Pendientes</h2>
      <DndContext sensors={sensores} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={llamadosDashboard.pendientes.map(p => p.id_llamado.toString())} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {llamadosDashboard.pendientes.map(p => (
              <SortableItem
                key={p.id_llamado}
                id={p.id_llamado.toString()}
                nombre={p.paciente?.nombre_completo ?? "Paciente"}
                prioridad={p.prioridad}
                id_paciente={p.id_paciente}
                onConfirmarAccion={(accion) => confirmarCambioEstado(p.id_llamado, accion, p.paciente?.nombre_completo ?? "Paciente")}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <h2 className="text-2xl font-bold mb-4 text-indigo-700">✅ Últimos Atendidos</h2>
      <div className="space-y-2">
        {llamadosDashboard.atendidos.map(p => (
          <div key={p.id_llamado} className="bg-green-100 rounded-xl shadow p-4 border-l-4 border-green-700">
            <p className="text-lg font-semibold text-green-900">{p.paciente?.nombre_completo ?? p.id_paciente}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

function SortableItem({ id_paciente, id, nombre, prioridad, onConfirmarAccion }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-xl shadow p-4 flex justify-between items-center border-l-4 border-indigo-500"
    >
      <div className="flex items-center gap-2">
        {/* 🔥 Drag handle */}
        <div {...listeners} className="cursor-grab px-2">
          ☰
        </div>
        <div>
          <p className="text-lg font-semibold text-indigo-900">{nombre}</p>
          <p className="text-sm text-gray-600">ID: {id_paciente}</p>
          <p className="text-sm text-gray-500">Prioridad: {prioridad}</p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("BOTÓN LLAMAR PRESIONADO");
            onConfirmarAccion("Llamado");
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg shadow"
        >
          Llamar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("BOTÓN ATENDIDO PRESIONADO");
            onConfirmarAccion("Atendido");
          }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-lg shadow"
        >
          Atendido
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("BOTÓN CANCELAR PRESIONADO");
            onConfirmarAccion("Cancelado");
          }}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1 rounded-lg shadow"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
