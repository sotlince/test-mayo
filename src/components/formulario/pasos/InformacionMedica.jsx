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
        icon: "error",
        title: "Falta el motivo de consulta",
        text: "Por favor selecciona el motivo de consulta antes de continuar.",
      });
      return;
    }
  
    if (condicion.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Falta la condición médica",
        text: "Por favor selecciona al menos una condición médica.",
      });
      return;
    }
  
    if (alergia.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Falta la alergia",
        text: "Por favor selecciona al menos una alergia.",
      });
      return;
    }
  
    if (medicamento === "si" && !cualMedicamento.trim()) {
      Swal.fire({
        icon: "error",
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
  

  return (
    <Layout video="video2">
      <div className="container">
        <div className="row">
          <div className="col col-12 mb-5">
            <div className="card">
              <h3 className="title-card">Información Médica</h3>
              <div className="grup-form">
                <div className="col">
                  <div className="cont-select">
                    <InputLabel shrink>¿Alguna condición?</InputLabel>
                    <Select
                      multiple
                      value={condicion}
                      onChange={handleChange2}
                      input={<OutlinedInput />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {tipoCondicion.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={condicion.includes(name)} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="col">
                  <div className="cont-select">
                    <InputLabel shrink>¿Alguna Alergia?</InputLabel>
                    <Select
                      multiple
                      value={alergia}
                      onChange={handleChange3}
                      input={<OutlinedInput />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {tipoAlergia.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={alergia.includes(name)} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="col">
                  <div className="cont-toggle">
                    <InputLabel>¿Tomas algún medicamento?</InputLabel>
                    <ToggleButtonGroup
                      color="primary"
                      value={medicamento}
                      exclusive
                      onChange={handleMedicamentos}
                      aria-label="medicamento"
                    >
                      <ToggleButton value="si"><SiIcon /></ToggleButton>
                      <ToggleButton value="no"><NoIcon /></ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>

                {medicamento === "si" && (
                  <div className="col">
                    <TextField
                      label="¿Cuál?"
                      variant="standard"
                      value={cualMedicamento}
                      onChange={(e) => setCualMedicamento(e.target.value)}
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col col-12">
            <div className="card">
              <h3 className="title-card">Motivo de Consulta</h3>
              <div className="grup-form">
                <div className="col">
                  <div className="cont-select">
                    <InputLabel shrink>¿Por qué vienes al hospital / clínica?</InputLabel>
                    <Select
                      value={condiciones}
                      onChange={handleChange}
                      displayEmpty
                      notched
                    >
                      <MenuItem value="Dolores">Dolores</MenuItem>
                      <MenuItem value="Mareos">Mareos</MenuItem>
                      <MenuItem value="Fractura">Fractura</MenuItem>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
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
