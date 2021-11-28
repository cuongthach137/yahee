import { useState, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { useFormContext } from "react-hook-form";
import GaugeMeter from "../Gauge Meter/GaugeMeter";

const RangeSlider = ({ type, setPote, ...rest }) => {
  const { setValue, getValues } = useFormContext();
  const [val, setVal] = useState([0, 15]);
  function handleChange(event, newVal) {
    setVal(newVal);
  }
  function handleSetValue(event, newVal) {
    if (type === "thc_content") {
      setValue("details.thc_content", newVal);
    } else if (type === "cbd_content") {
      setValue("details.cbd_content", newVal);
    }
    if (getValues("details.cbd_content") && getValues("details.thc_content")) {
      calPotency();
    }
  }
  function calPotency() {
    const cbd = getValues("details.cbd_content")[1];
    const thc = getValues("details.thc_content")[1];
    let difference = cbd - thc;

    //i know this is stupid but it does half the job and im fine with it
    if (difference <= 15 && difference >= 0) {
      setValue("details.potency", "Mild");
      setPote("Mild");
    } else if (difference > 15 && difference <= 50) {
      setValue("details.potency", "Very Mild");
      setPote("Very Mild");
    } else if (difference > 50 && difference <= 66) {
      setValue("details.potency", "Extremely Mild");
      setPote("Extremely Mild");
    } else if (difference > 66) {
      setValue("details.potency", "Little To Minimal");
      setPote("Little To Minimal");
    } else if (difference < 0 && difference >= -15) {
      setValue("details.potency", "Mild");
      setPote("Mild");
    } else if (difference < -15 && difference >= -31) {
      setValue("details.potency", "Strong");
      setPote("Strong");
    } else if (difference >= -50 && difference < -31) {
      setValue("details.potency", "Very Strong");
      setPote("Very Strong");
    } else if (difference > -50 && difference <= -66) {
      setValue("details.potency", "Very Strong");
      setPote("Very Strong");
    } else if (difference < -66) {
      setValue("details.potency", "Insanely Strong");
      setPote("Insanely Strong");
    }
  }
  useEffect(() => {
    if (rest.mode !== "edit") {
      setValue("details.cbd_content", [0, 0]);
      setValue("details.thc_content", [0, 0]);
    }
  }, [rest.mode, setValue]);
  return (
    <div className={`productInfo__${type} thc__cbd__content`}>
      <GaugeMeter
        something={val[1]}
        type={type === "thc_content" ? "THC" : "CBD"}
      />

      <Slider
        {...rest}
        value={val}
        onChange={handleChange}
        onChangeCommitted={handleSetValue}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </div>
  );
};

export default RangeSlider;
