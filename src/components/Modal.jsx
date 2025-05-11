export default function Modal({title, children, isOpen, onClose, onSave, saveLabel = "Guardar"}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">
              {title}
            </h3>
            {children}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Cerrar
              </button>
              {onSave && <button onClick={() => onSave()} className="bg-blue-500 text-white px-4 py-2 rounded">{saveLabel}</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
