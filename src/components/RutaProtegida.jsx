import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RutaProtegida({ rolesPermitidos, children }) {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <p className="text-center mt-10 text-gray-600">Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/login" />;
  }

  return children; // ✅ ahora sí renderiza el contenido real
}
