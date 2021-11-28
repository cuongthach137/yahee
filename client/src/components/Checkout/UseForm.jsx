import React from "react";
import UserInformation from "./UserInformation";
import UserPaymentMethod from "./UserPaymentMethod";
import UserShippingPreference from "./UserShippingPreference";

const UseForm = ({ stepState }) => {
  const [step, setStep] = stepState;
  function nextStep() {
    return setStep((s) => s + 1);
  }
  function prevStep() {
    return setStep((s) => s - 1);
  }

  switch (step) {
    case 0:
      return <UserInformation next={nextStep} back={prevStep} />;
    case 1:
      return <UserShippingPreference next={nextStep} back={prevStep} />;
    case 2:
      return <UserPaymentMethod next={nextStep} back={prevStep} />;
    default:
      return <></>;
  }
};

export default UseForm;
