import React from "react";
import { useLocation } from "react-router-dom";
import { Stepper, Step, StepLabel } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import logoIcon from "../../assets/logo.png";

const steps = ["", "", "", ""];

const NumberStepIcon = ({ icon }) => {
  const isFirstStep = icon === 1;

  return (
    <div className="cicle">
      {isFirstStep ? <HomeIcon fontSize="small" /> : icon}
    </div>
  );
};

const Header = () => {
  const location = useLocation();

  // Mapeo de rutas a pasos
  const pathToStep = {
    "/formulario/datos-basicos": 0,
    "/formulario/informacion-medica": 1,
    "/formulario/localizar-dolor": 2,
    "/formulario/puntuar-dolor": 3,
  };

  const activeStep = pathToStep[location.pathname] ?? 0;

  return (
    <header className="header">
      <div className="cont-logo">
        <img src={logoIcon} alt="Logo" style={{ width: "40px", height: "auto", margin: "-3px" }} />
      </div>
      <div className="steps">
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepConnector-line": {
              borderColor: "white",
              borderTopWidth: 2,
            },
          }}
        >
          {steps.map((_, index) => (
            <Step key={index}>
              <StepLabel
                components={{
                  StepIcon: NumberStepIcon,
                }}
              />
            </Step>
          ))}
        </Stepper>
      </div>
    </header>
  );
};

export default Header;
