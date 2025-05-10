import React from "react";
import { Slider } from "@mui/material";

const ColoredSlider = (props) => {
  return (
    <div className="cont-pain">
      <Slider
        {...props} // ✅ REENVÍA todas las props al Slider interno
        aria-label="Temperature"
        valueLabelDisplay="auto"
        shiftStep={1}
        step={1}
        marks
        min={1}
        max={10}
      />
      <div className="contador">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
        <span>9</span>
        <span>10</span>
      </div>
    </div>
  );
};

export default ColoredSlider;
