import * as React from "react";
import TextField from "@mui/material/TextField";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import IconButton from "@mui/material/IconButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Swal from "sweetalert2";
import Ine from "../../../assets/INE.jpg";


const DatosBasicos = () => {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = React.useState("video1");


  const [nombreCompleto, setNombreCompleto] = React.useState("");
  const [rut, setRut] = React.useState("");
  const [telefonoContacto, setTelefonoContacto] = React.useState("");
  const [fechaNacimiento, setFechaNacimiento] = React.useState(dayjs());

  const [showError, setShowError] = React.useState(false);

  React.useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("datosBasicos"));
    if (datosGuardados) {
      if (datosGuardados.nombre_completo) setNombreCompleto(datosGuardados.nombre_completo);
      if (datosGuardados.rut) setRut(datosGuardados.rut);
      if (datosGuardados.telefono_contacto) setTelefonoContacto(datosGuardados.telefono_contacto);
      if (datosGuardados.fecha_nacimiento) setFechaNacimiento(dayjs(datosGuardados.fecha_nacimiento));
    }
  }, []);

  const handleClick = () => {
     // ✅ Agrega esto antes del modal
  window.speechSynthesis.cancel();
  const texto = "Este es un ejemplo de documento de identidad. Así debe ingresar su nombre.";
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-ES";
  window.speechSynthesis.speak(utterance);

    Swal.fire({
      title: "DNI Nombre",
      text: "",
      imageUrl: Ine,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Ejemplo de documento de identidad",
    });
  };

  const handleContinuar = () => {
    if (!nombreCompleto.trim() || !rut.trim() || !telefonoContacto.trim() || !fechaNacimiento) {
      setShowError(true);
      Swal.fire({
        title: "Faltan campos obligatorios",
        text: "Por favor completa todos los campos requeridos antes de continuar.",
        imageUrl: "/gifs/gif1.gif",
        imageAlt: "Advertencia: campos incompletos",
        imageWidth: 170, // puedes ajustar el tamaño
        imageHeight: 170,
      });
      return;
    }

    const datosBasicos = {
      nombre_completo: nombreCompleto,
      rut: rut,
      fecha_nacimiento: fechaNacimiento.format("YYYY-MM-DD"),
      telefono_contacto: telefonoContacto
    };

    localStorage.setItem("datosBasicos", JSON.stringify(datosBasicos));
    navigate("/formulario/informacion-medica");
  };
  const leerTexto = (texto) => {
    window.speechSynthesis.cancel(); // limpia si hay algo ya leyendo
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Layout video={currentVideo}>
      <div className="container">
        <div className="row">

          {/* Datos Básicos */}
          <fieldset className="col col-12 mb-5 card">
            <legend className="title-card">Datos básicos del paciente</legend>
            <div className="grup-form">

              {/* Nombre */}
              <div className="col">
                <div className="cont-input">
                  <TextField
                    id="nombre-completo"
                    label="Nombre Completo"
                    variant="standard"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    onFocus={() => setCurrentVideo("video2")}
                    inputProps={{ 'aria-describedby': 'info-nombre' }}
                  />
                  <IconButton
                    onClick={handleClick}
                    aria-label="Ver ejemplo de documento de identidad"
                  >
                    <InfoOutlineIcon />
                  </IconButton>

                  <span id="info-nombre" className="sr-only">
                    Pulsa el ícono para ver ejemplo de documento.
                  </span>
                </div>
              </div>

              {/* Fecha de nacimiento */}
              <div className="col">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="cont-input">
                    <DatePicker
                      label="Fecha de nacimiento"
                      value={fechaNacimiento}
                      onChange={(newValue) => setFechaNacimiento(newValue)}
                      onFocus={() => setCurrentVideo("video3")}
                      onOpen={() => setCurrentVideo("video3")}
                      slotProps={{
                        textField: {
                          variant: "standard",
                          InputLabelProps: { shrink: true },
                          inputProps: { 'aria-describedby': 'info-fecha' }
                        }
                      }}
                    />
                    <IconButton
                      onClick={() => leerTexto("Por favor selecciona tu fecha de nacimiento")}                  
                      aria-label="Información sobre fecha de nacimiento"
                    >
                      <InfoOutlineIcon />
                    </IconButton>
                    <span id="info-fecha" className="sr-only">
                      Selecciona tu fecha de nacimiento.
                    </span>
                  </div>
                </LocalizationProvider>
              </div>

              {/* RUT */}
              <div className="col">
                <div className="cont-input">
                  <TextField
                    label="RUT"
                    variant="standard"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    onFocus={() => setCurrentVideo("video4")}
                    inputProps={{ 'aria-describedby': 'info-rut' }}
                  />
                  <IconButton 
                  onClick={() => leerTexto("Por favor ingresa tu RUT con guión")}
                  aria-label="Información sobre el campo RUT">
                    <InfoOutlineIcon />
                  </IconButton>
                  <span id="info-rut" className="sr-only">
                    Ingrese el RUT con guion.
                  </span>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Información de contacto */}
          <fieldset className="col col-12 card">
            <legend className="title-card">Información de Contacto</legend>
            <div className="grup-form">
              <div className="col">
                <div className="cont-input">
                  <TextField
                    label="Teléfono de Emergencia"
                    variant="standard"
                    value={telefonoContacto}
                    onChange={(e) => setTelefonoContacto(e.target.value)}
                    onFocus={() => setCurrentVideo("video1")}
                    inputProps={{ 'aria-describedby': 'info-telefono' }}
                  />
                  <IconButton 
                  onClick={() => leerTexto("Por favor ingresa tu teléfono de emergencia")}
                  aria-label="Información sobre teléfono de emergencia">
                    <InfoOutlineIcon />
                  </IconButton>
                  <span id="info-telefono" className="sr-only">
                    Ingresa un número donde puedan ubicarte.
                  </span>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Mensaje de error visible para accesibilidad */}
          {showError && (
            <div role="alert" className="mt-3 text-red-600">
              Debes completar todos los campos obligatorios.
            </div>
          )}

        </div>

        {/* Botón Continuar */}
        <div className="footer mt-4">
          <Button
            onClick={handleContinuar}
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
            aria-label="Ir al formulario de información médica"
            title="Continuar al siguiente paso del formulario"
          >
            Continuar
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default DatosBasicos;
