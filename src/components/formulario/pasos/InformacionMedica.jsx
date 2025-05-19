import * as React from "react";
import TextField from "@mui/material/TextField";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import NoIcon from "@mui/icons-material/HighlightOffOutlined";
import SiIcon from "@mui/icons-material/CheckCircleOutlined";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import Swal from "sweetalert2";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tipoCondicion = ["Diabetes", "Hipertensión", "Asma"];
const tipoAlergia = ["Arañas", "Flores", "Polen"];

const InformacionMedica = () => {
  const [condiciones, setcondiciones] = React.useState("");
  const [condicion, setCondicion] = React.useState([]);
  const [alergia, setAlergia] = React.useState([]);
  const [medicamento, setMedicamentos] = React.useState("no");
  const [cualMedicamento, setCualMedicamento] = React.useState("");
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = React.useState("video2");

  // ✅ Cargar datos guardados al volver
  React.useEffect(() => {
    const datosGuardados = JSON.parse(localStorage.getItem("informacionMedica"));
    if (datosGuardados) {
      if (datosGuardados.condiciones) setcondiciones(datosGuardados.condiciones);
      if (datosGuardados.condicion) setCondicion(datosGuardados.condicion);
      if (datosGuardados.alergia) setAlergia(datosGuardados.alergia);
      if (datosGuardados.medicamento) setMedicamentos(datosGuardados.medicamento);
      if (datosGuardados.cual_medicamento) setCualMedicamento(datosGuardados.cual_medicamento);
    }
  }, []);

  const handleMedicamentos = (event, newMed) => {
    if (newMed !== null) {
      setMedicamentos(newMed);
    }
  };

  const handleChange = (event) => {
    setcondiciones(event.target.value);
  };

  const handleChange2 = (event) => {
    const { target: { value } } = event;
    setCondicion(typeof value === "string" ? value.split(",") : value);
  };

  const handleChange3 = (event) => {
    const { target: { value } } = event;
    setAlergia(typeof value === "string" ? value.split(",") : value);
  };

  const handleContinuar = () => {
    if (!condiciones.trim()) {
      Swal.fire({
        imageUrl: "/gifs/gif2.gif",
        title: "Falta el motivo de consulta",
        text: "Por favor selecciona el motivo de consulta antes de continuar.",
      });
      return;
    }
  
    if (condicion.length === 0) {
      Swal.fire({
        title: "Faltan campos obligatorios",
        text: "Por favor selecciona al menos una condición médica.",
        imageUrl: "/gifs/gif1.gif",
        imageAlt: "Advertencia: campos incompletos",
        imageWidth: 170, // puedes ajustar el tamaño
        imageHeight: 170,
      });
      return;
    }
  
    if (alergia.length === 0) {
      Swal.fire({
        imageUrl: "/gifs/gif2.gif",
        title: "Falta la alergia",
        text: "Por favor selecciona al menos una alergia.",
      });
      return;
    }
  
    if (medicamento === "si" && !cualMedicamento.trim()) {
      Swal.fire({
        imageUrl: "/gifs/gif1.gif",
        title: "Falta especificar medicamento",
        text: "Por favor indica cuál medicamento tomas.",
      });
      return;
    }
  
    const infoMedica = {
      condiciones: condiciones,
      condicion: condicion,
      alergia: alergia,
      medicamento: medicamento,
      cual_medicamento: cualMedicamento
    };
  
    // ✅ Guardar en localStorage
    localStorage.setItem("informacionMedica", JSON.stringify(infoMedica));
  
    // ✅ Mostrar qué datos están viajando
    console.log("✅ informacionMedica:", infoMedica);
  
    const datosBasicos = JSON.parse(localStorage.getItem("datosBasicos"));
    console.log("✅ datosBasicos:", datosBasicos);
  
    navigate("/formulario/localizar-dolor");
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
    <div className="col col-12 mb-5">
      <fieldset className="card">
      <legend className="title-card">Información Médica</legend>
        {/* <h3 className="title-card">Información Médica</h3> */}
        <div className="grup-form">

          {/* Condiciones */}
          <div className="col">
            <div className="cont-select">
              <InputLabel id="condicion-label" shrink htmlFor="select-condiciones">¿Alguna condición?</InputLabel>
              
              <Select
                id="select-condiciones"
                labelId="condicion-label"
                multiple
                value={condicion}
                onChange={handleChange2}
                onFocus={() => setCurrentVideo("video1")}
                onClick={() => leerTexto("Selecciona una o más condiciones médicas como asma, hipertensión o diabetes.")}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                aria-describedby="info-condicion"
              >
                {tipoCondicion.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={condicion.includes(name)} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <span id="info-condicion" className="sr-only">
                Selecciona una o más condiciones médicas previas como asma o hipertensión.
              </span>
            </div>
          </div>

          {/* Alergias */}
          <div className="col">
            <div className="cont-select">
              <InputLabel id="alergia-label" shrink htmlFor="select-alergias">¿Alguna Alergia?</InputLabel>
              <Select
                id="select-alergias"
                labelId="alergia-label"
                multiple
                value={alergia}
                onChange={handleChange3}
                onFocus={() => setCurrentVideo("video2")}
                onClick={() => leerTexto("Selecciona una o más alergias como arañas, Flores o Polen.")}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                aria-describedby="info-alergia"
              >
                {tipoAlergia.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={alergia.includes(name)} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
              <span id="info-alergia" className="sr-only">
                Selecciona las alergias que tengas, por ejemplo a polen, flores o insectos.
              </span>
            </div>
          </div>

          {/* Medicamentos */}
          <div className="col">
            <div className="cont-toggle">
              <InputLabel id="medicamento-label">¿Tomas algún medicamento?</InputLabel>
              <ToggleButtonGroup
                color="primary"
                value={medicamento}
                exclusive
                onChange={handleMedicamentos}
                onFocus={() => setCurrentVideo("video3")}
                aria-labelledby="medicamento-label"
                aria-describedby="info-medicamento"
              >
                <ToggleButton value="si" aria-label="Sí toma medicamentos"><SiIcon /></ToggleButton>
                <ToggleButton value="no" aria-label="No toma medicamentos"><NoIcon /></ToggleButton>
              </ToggleButtonGroup>
              <span id="info-medicamento" className="sr-only">
                Indica si estás tomando algún medicamento actualmente.
              </span>
            </div>
          </div>

          {/* ¿Cuál medicamento? */}
          {medicamento === "si" && (
            <div className="col">
              <TextField
                id="cual-medicamento"
                label="¿Cuál?"
                variant="standard"
                value={cualMedicamento}
                onFocus={() => setCurrentVideo("video4")}
                onChange={(e) => setCualMedicamento(e.target.value)}
                inputProps={{
                  'aria-describedby': 'info-cual-medicamento'
                }}
              />
              <span id="info-cual-medicamento" className="sr-only">
                Especifica el nombre del medicamento que tomas actualmente.
              </span>
            </div>
          )}

        </div>
      </fieldset>
    </div>

    {/* Motivo de Consulta */}
    <div className="col col-12">
      <fieldset className="card">
        {/* <h3 className="title-card">Motivo de Consulta</h3> */}
        <legend className="title-card">Motivo de Consulta</legend>
        <div className="grup-form">
          <div className="col">
            <div className="cont-select">
              <InputLabel id="motivo-label" shrink htmlFor="select-motivo">¿Por qué vienes al hospital / clínica?</InputLabel>
              <Select
                id="select-motivo"
                labelId="motivo-label"
                value={condiciones}
                onFocus={() => setCurrentVideo("video1")}
                onClick={() => leerTexto("Selecciona la razón por la que vienes al hospital como Dolores, Mareos o Fractura.")}
                onChange={handleChange}
                displayEmpty
                notched
                aria-describedby="info-motivo"
              >
                <MenuItem value="Dolores">Dolores</MenuItem>
                <MenuItem value="Mareos">Mareos</MenuItem>
                <MenuItem value="Fractura">Fractura</MenuItem>
              </Select>
              <span id="info-motivo" className="sr-only">
                Selecciona el motivo principal de tu consulta médica actual.
              </span>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</div>


      {/* Botones */}
      <div className="footer btns-dos">
        <Button
          variant="outlined"
          onClick={() => navigate("/formulario/datos-basicos")}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          endIcon={<KeyboardArrowRightIcon />}
          onClick={handleContinuar}
        >
          Continuar
        </Button>
      </div>
    </Layout>
  );
};

export default InformacionMedica;
