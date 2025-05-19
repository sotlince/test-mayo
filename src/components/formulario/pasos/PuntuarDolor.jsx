import React from "react";
import Layout from "../Layout";
import CloseIcon from "@mui/icons-material/Close";
import ColoredSlider from "../SliderPain";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Swal from "sweetalert2";

const PuntuarDolor = () => {
  const navigate = useNavigate();
  const zonasDolor = JSON.parse(localStorage.getItem("zonasDolor")) || [];

  // ✅ Inicializa puntuaciones en 0
  const [puntuaciones, setPuntuaciones] = React.useState(() => {
    const inicial = {};
    zonasDolor.forEach((zona) => {
      inicial[zona.id.toString()] = 0;
    });
    console.log("👉 Inicial puntuaciones:", inicial);
    return inicial;
  });

  const leerTexto = (texto) => {
    window.speechSynthesis.cancel(); // detiene lecturas previas
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Cada vez que cambias un slider, actualiza solo esa zona
  const handleSliderChange = (id, value) => {
    const idStr = id.toString();
    const updated = { ...puntuaciones, [idStr]: value };
    setPuntuaciones(updated);
      // GUARDA CADA VEZ QUE CAMBIA
    localStorage.setItem("puntuacionesDolor", JSON.stringify(updated));

    console.log("📝 Gravedades actualizadas:", updated);
  };

  const handleClick = () => {
    const datosBasicos = JSON.parse(localStorage.getItem("datosBasicos"));
    const informacionMedica = JSON.parse(localStorage.getItem("informacionMedica"));
  
    if (!datosBasicos || !informacionMedica || zonasDolor.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Faltan datos",
        text: "Por favor completa todos los pasos antes de enviar.",
      });
      return;
    }
  
    const zonasValidas = zonasDolor.slice(0, 3);
  
    // ✅ AHORA LEE DIRECTO DEL ESTADO ACTUALIZADO
    const puntuacionesActualizadas = puntuaciones;
  
    const sintomas = zonasValidas.map((zona) => ({
      zona_cuerpo: zona.label || "Zona desconocida",
      descripcion: `Dolor en ${zona.label || "zona desconocida"}`,
      gravedad: puntuacionesActualizadas[zona.id.toString()] ?? 0,
    }));
  
    const pacienteFinal = {
      ...datosBasicos,
      sexo: informacionMedica?.sexo ?? "Otro",
      tipo_discapacidad: informacionMedica?.tipo_discapacidad ?? "No especificado",
      modo_comunicacion: informacionMedica?.modo_comunicacion ?? "No especificado",
      ayudas_tecnicas:
        Array.isArray(informacionMedica?.ayudas_tecnicas) && informacionMedica.ayudas_tecnicas.length > 0
          ? informacionMedica.ayudas_tecnicas
          : ["Sin ayudas"],
      avatar_url: informacionMedica?.avatar_url ?? "https://example.com/default-avatar.png",
      requiere_asistencia: informacionMedica?.requiere_asistencia ?? false,
      contacto_emergencia: informacionMedica.contacto_emergencia || {
        nombre: "No especificado",
        telefono: "",
        parentesco: "",
      },
      antecedentes:
        Array.isArray(informacionMedica.condicion) && informacionMedica.condicion.length > 0
          ? informacionMedica.condicion
          : ["Sin antecedentes"],
      sintomas,
    };
  
    console.log("📦 JSON COMPLETO ANTES DE ENVIAR:", pacienteFinal);
  
    localStorage.setItem("formularioCompleto", JSON.stringify(pacienteFinal));
  
    Swal.fire({
      title: "¿Estás seguro que deseas enviar esta información?",
      imageUrl: "/gifs/gif2.gif",
      imageWidth: 170, // puedes ajustar el tamaño
      imageHeight: 170,
      showCancelButton: true,
      confirmButtonText: "Estoy seguro",
      cancelButtonText: "Volver",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#f28b82",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarAlBackend(pacienteFinal);
      }
    });
  };
  
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      leerTexto("Indica el nivel de dolor en cada zona seleccionada usando el control deslizante.");
    }, 500); // da un pequeño retardo para evitar conflicto con carga visual
  
    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel(); // corta lectura si el usuario cambia de vista rápido
    };
  }, []);

  const enviarAlBackend = async (pacienteFinal) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/pacientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacienteFinal),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        Swal.fire({
          icon: "success",
          title: "Paciente registrado",
          text: "Los datos fueron enviados correctamente.",
        });

        localStorage.removeItem("datosBasicos");
        localStorage.removeItem("informacionMedica");
        localStorage.removeItem("zonasDolor");
        localStorage.removeItem("puntuacionesDolor");
        localStorage.removeItem("formularioCompleto");

        navigate("/formulario/datos-basicos");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.mensaje || "No se pudo registrar el paciente.",
        });
      }
    } catch (error) {
      console.error("❌ Error al enviar:", error);
      Swal.fire({
        title: "Error de conexión",
        text: "Debes seleccionar el nivel de gravedad.",
        imageUrl: "/gifs/gif1.gif",
        imageWidth: 170, // puedes ajustar el tamaño
        imageHeight: 170,
      });
    }
  };

  return (
    <Layout video="video2">

<div className="container">
  <div className="row">
    <div className="col col-12 mb-5">
      <fieldset className="card">
        <legend className="title-card">¿Cuánto te duele?</legend>
        <div className="grup-card">
          {zonasDolor.length === 0 ? (
            <p role="alert">No hay zonas seleccionadas. Vuelve al paso anterior.</p>
          ) : (
            zonasDolor.map((op) => (
              <fieldset key={op.id} className="card puntuar-dolor">
                <legend className="sr-only">Zona: {op.label}</legend>

                <div className="close" aria-hidden="true">
                  <CloseIcon />
                </div>

                <div className="cont-center">
                  <img
                    src={`/img-localizar-dolor/ld-${op.id || "placeholder"}.webp`}
                    alt={`Imagen ilustrativa de la zona: ${op.label}`}
                  />
                  <div className="ri">
                    <h4 className="titulo">{op.label}</h4>
                    <p className="lado">ZONA</p>
                  </div>
                </div>

                <div className="puntuar">
                  <label htmlFor={`slider-${op.id}`} className="sr-only">
                    Nivel de dolor para la zona {op.label}
                  </label>
                  <ColoredSlider
                    id={`slider-${op.id}`}
                    value={puntuaciones[op.id.toString()]}
                    onChange={(e, value) => handleSliderChange(op.id.toString(), value)}
                    aria-valuetext={`Dolor nivel ${puntuaciones[op.id.toString()]}`}
                    aria-label={`Dolor en ${op.label}`}
                  />
                </div>
              </fieldset>
            ))
          )}
        </div>
      </fieldset>
    </div>
  </div>
</div>

      <div className="footer btns-dos">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/formulario/localizar-dolor")}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Volver
        </Button>
        <Button variant="contained" onClick={handleClick} endIcon={<SendIcon />}>
          ENVIAR
        </Button>
      </div>
    </Layout>
  );
};

export default PuntuarDolor;
