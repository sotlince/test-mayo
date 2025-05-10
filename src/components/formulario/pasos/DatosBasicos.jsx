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

  // 📌 Estado para los campos
  const [nombreCompleto, setNombreCompleto] = React.useState("");
  const [rut, setRut] = React.useState("");
  const [telefonoContacto, setTelefonoContacto] = React.useState("");
  const [fechaNacimiento, setFechaNacimiento] = React.useState(dayjs());

  // ✅ Recuperar datos guardados al cargar la página
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
    Swal.fire({
      title: "DNI Nombre",
      text: "",
      imageUrl: Ine,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "Custom image",
    });
  };

  const handleContinuar = () => {
    if (!nombreCompleto.trim() || !rut.trim() || !telefonoContacto.trim() || !fechaNacimiento) {
      Swal.fire({
        icon: "error",
        title: "Faltan campos obligatorios",
        text: "Por favor completa todos los campos requeridos antes de continuar.",
      });
      return; // 👈 Evita continuar si falta algo
    }
  
    const datosBasicos = {
      nombre_completo: nombreCompleto,
      rut: rut,
      fecha_nacimiento: fechaNacimiento.format("YYYY-MM-DD"),
      telefono_contacto: telefonoContacto
    };
  
    localStorage.setItem("datosBasicos", JSON.stringify(datosBasicos));
  
    console.log("✅ datosBasicos:", datosBasicos);
  
    navigate("/formulario/informacion-medica");
  };

  return (
    <Layout video={currentVideo}>
      <div className="container">
        <div className="row">
          <div className="col col-12 mb-5">
            <div className="card">
              <h3 className="title-card">Datos básicos del paciente</h3>
              <div className="grup-form">
                {/* Nombre Completo */}
                <div className="col">
                  <div className="cont-input">
                    <TextField
                      label="Nombre Completo"
                      variant="standard"
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                      onFocus={() => setCurrentVideo("video2")}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                    <IconButton onClick={handleClick}>
                      <InfoOutlineIcon />
                    </IconButton>
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
                        onOpen={() => setCurrentVideo("video3")}
                        slotProps={{
                          textField: {
                            variant: "standard",
                            InputLabelProps: { shrink: true },
                          },
                        }}
                      />
                      <IconButton>
                        <InfoOutlineIcon />
                      </IconButton>
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
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                    <IconButton>
                      <InfoOutlineIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="col col-12">
            <div className="card">
              <h3 className="title-card">Información de Contacto</h3>
              <div className="grup-form">
                {/* Teléfono */}
                <div className="col">
                  <div className="cont-input">
                    <TextField
                      label="Teléfono de Emergencia"
                      variant="standard"
                      value={telefonoContacto}
                      onChange={(e) => setTelefonoContacto(e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                    <IconButton>
                      <InfoOutlineIcon />
                    </IconButton>
                  </div>
                </div>

                {/* Dirección (visual) */}
                <div className="col">
                  <div className="cont-input">
                    <TextField
                      label="Dirección (opcional)"
                      variant="standard"
                      disabled
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                    <IconButton>
                      <InfoOutlineIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Continuar */}
      <div className="footer">
        <Button
          onClick={handleContinuar}
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
        >
          Continuar
        </Button>
      </div>
    </Layout>
  );
};

export default DatosBasicos;
