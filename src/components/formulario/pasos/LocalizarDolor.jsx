import React from "react";
import {
  Button,
  Checkbox,
  FormGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BodyFrontal from "../../../assets/cuerpo-frente.svg";
import BodyReverso from "../../../assets/cuerpo-atras.svg";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LocalizarDolor = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = React.useState("frontal");
  const [selectedValues, setSelectedValues] = React.useState([]);

  const options = [
    { id: 1, label: "cabeza_arriba_front", punto: 1 },
    { id: 2, label: "oreja_derecha_front", punto: 2 },
    { id: 3, label: "oreja_izquierda_front", punto: 3 },
    { id: 4, label: "cuello_front", punto: 4 },
    { id: 5, label: "hombro_derecho_front", punto: 5 },
    { id: 6, label: "hombro_izquierdo_front", punto: 6 },
    { id: 7, label: "pecho_front", punto: 7 },
    { id: 8, label: "brazo_derecho_front", punto: 8 },
    { id: 9, label: "brazo_izquierdo_front", punto: 9 },
    { id: 10, label: "mano_derecha_front", punto: 10 },
    { id: 11, label: "mano_izquierda_front", punto: 11 },
    { id: 12, label: "genitales_front", punto: 12 },
    { id: 13, label: "muslo_derecho_front", punto: 13 },
    { id: 14, label: "muslo_izquierdo_front", punto: 14 },
    { id: 15, label: "rodilla_derecha_front", punto: 15 },
    { id: 16, label: "rodilla_izquierda_front", punto: 16 },
    { id: 17, label: "canilla_derecha_front", punto: 17 },
    { id: 18, label: "canilla_izquierda_front", punto: 18 },
    { id: 19, label: "pie_derecho_front", punto: 19 },
    { id: 20, label: "pie_izquierdo_front", punto: 20 },
  ];

  const options2 = [
    { id: 21, label: "cabeza_arriba_back", punto: 1 },
    { id: 22, label: "oreja_izquierda_back", punto: 2 },
    { id: 23, label: "oreja_derecha_back", punto: 3 },
    { id: 24, label: "cervical_back", punto: 4 },
    { id: 25, label: "hombro_izquierdo_back", punto: 5 },
    { id: 26, label: "hombro_derecho_back", punto: 6 },
    { id: 27, label: "espalda_back", punto: 7 },
    { id: 28, label: "codo_izquierdo", punto: 8 },
    { id: 29, label: "codo_derecho", punto: 9 },
    { id: 30, label: "mano_izquierda_back", punto: 10 },
    { id: 31, label: "mano_derecha_back", punto: 11 },
    { id: 32, label: "ano_back", punto: 12 },
    { id: 33, label: "muslo_izquierdo_back", punto: 13 },
    { id: 34, label: "muslo_derecho_back", punto: 14 },
    { id: 35, label: "rodilla_izquierda_back", punto: 15 },
    { id: 36, label: "rodilla_derecha_back", punto: 16 },
    { id: 37, label: "muslo_izquierdo_back", punto: 17 },
    { id: 38, label: "muslo_derecho_back", punto: 18 },
    { id: 39, label: "talon_izquierdo_back", punto: 19 },
    { id: 40, label: "talon_derecho_back", punto: 20 },
  ];

  const todasLasOpciones = [...options, ...options2];

  const leerTexto = (texto) => {
    window.speechSynthesis.cancel(); // detener lecturas anteriores
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  const handleToggle = (event, newMed) => {
    if (newMed !== null) {
      setToggle(newMed);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const foundOption = todasLasOpciones.find((opt) => opt.id.toString() === value);
  
    if (!foundOption) return;
  
    const exists = selectedValues.some((zona) => zona.id === foundOption.id);
  
    if (exists) {
      setSelectedValues(selectedValues.filter((zona) => zona.id !== foundOption.id));
    } else {
      if (selectedValues.length < 3) {
        setSelectedValues([...selectedValues, foundOption]);
      } else {
        Swal.fire({      
          title: "Límite de selección",
          text: "Solo puedes seleccionar máximo 3 zonas del cuerpo.",
          imageUrl: "/gifs/gif1.gif",
          imageWidth: 170, // puedes ajustar el tamaño
          imageHeight: 170,
        });
      }
    }
  };

  // ✅ Al volver atrás, cargar las zonas seleccionadas completas
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("zonasDolor"));
    if (saved && Array.isArray(saved)) {
      setSelectedValues(saved);  // 👈 NO map a string, solo asigna directamente
    }
  }, []);

  React.useEffect(() => {
    // Espera a que la vista esté completamente montada antes de hablar
    const timeout = setTimeout(() => {
      leerTexto("Selecciona hasta tres zonas donde sientas dolor. Usa los botones para cambiar entre vista frontal y reverso.");
    }, 400); // leve retardo para no chocar con render o cambios de foco
  
    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel(); // corta cualquier voz activa al desmontar
    };
  }, []);
  

  const handleContinuar = () => {
    if (selectedValues.length === 0) {
      Swal.fire({
        title: "Selección obligatoria",
        text: "Debes seleccionar al menos una zona del cuerpo.",
        imageUrl: "/gifs/gif2.gif",
        imageWidth: 170, // puedes ajustar el tamaño
        imageHeight: 170,
      });
      return;
    }
  
    console.log("✅ Zonas seleccionadas:", selectedValues);
  
    localStorage.setItem("zonasDolor", JSON.stringify(selectedValues));
  
    // const formPrevio = JSON.parse(localStorage.getItem("formularioCompleto")) || {};
    // const nuevoForm = { ...formPrevio, zonasDolor: selectedValues };
    // localStorage.setItem("formularioCompleto", JSON.stringify(nuevoForm));
  
    navigate("/formulario/puntuar-dolor");
  };

  return (
    <Layout video="video2">
  <div className="container">
  <div className="row">
    <div className="col col-12 mb-5">
      <fieldset className="card">
        <legend className="title-card">¿Dónde te duele?</legend>
        <div className="row">
          <div className="col col-12">
            <div className="grup-bodies">

              {/* Alternar vista */}
              <div className="btns-b">
                <div className="cont-toggle">
                  <ToggleButtonGroup
                    color="primary"
                    value={toggle}
                    exclusive
                    onChange={handleToggle}
                    aria-label="Seleccionar vista del cuerpo"
                    aria-describedby="info-toggle"
                  >
                    <ToggleButton value="frontal" aria-label="Vista frontal del cuerpo">FRONTAL</ToggleButton>
                    <ToggleButton value="reverso" aria-label="Vista posterior del cuerpo">REVERSO</ToggleButton>
                  </ToggleButtonGroup>
                  <span id="info-toggle" className="sr-only">
                    Usa este selector para cambiar entre vista frontal y reverso del cuerpo.
                  </span>
                </div>
              </div>

              {/* Imagen y selección */}
              <div className="cont-bodies" aria-describedby="info-cuerpo">
                {toggle === "frontal" && (
                  <FormGroup className="grup-check body-frontal">
                    <img src={BodyFrontal} alt="Vista frontal del cuerpo humano" />
                    {options.map((option) => (
                      <Checkbox
                        key={option.id}
                        className={`points-body point${option.punto}`}
                        checked={selectedValues.some(zona => zona.id === option.id)}
                        onChange={handleChange}
                        value={option.id}
                        disabled={
                          !selectedValues.some(zona => zona.id === option.id) &&
                          selectedValues.length >= 3
                        }
                        aria-label={`Seleccionar zona ${option.label.replace(/_/g, " ")}`}
                      />
                    ))}
                  </FormGroup>
                )}
                {toggle === "reverso" && (
                  <FormGroup className="grup-check body-reverso">
                    <img src={BodyReverso} alt="Vista posterior del cuerpo humano" />
                    {options2.map((option) => (
                      <Checkbox
                        key={option.id}
                        className={`points-body point${option.punto}`}
                        checked={selectedValues.some(zona => zona.id === option.id)}
                        onChange={handleChange}
                        value={option.id}
                        disabled={
                          !selectedValues.some(zona => zona.id === option.id) &&
                          selectedValues.length >= 3
                        }
                        aria-label={`Seleccionar zona ${option.label.replace(/_/g, " ")}`}
                      />
                    ))}
                  </FormGroup>
                )}
                <span id="info-cuerpo" className="sr-only">
                  Puedes seleccionar hasta tres zonas del cuerpo donde sientas dolor.
                </span>
              </div>

            </div>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</div>


      <div className="footer btns-dos">
        <Button
          variant="outlined"
          onClick={() => navigate("/formulario/informacion-medica")}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={handleContinuar}
          endIcon={<KeyboardArrowRightIcon />}
        >
          Continuar
        </Button>
      </div>
    </Layout>
  );
};

export default LocalizarDolor;