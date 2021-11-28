import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import checkoutSchema from "../../validations/checkoutSchema";
import UseForm from "./UseForm";

const CheckoutForm = () => {
  const [step, setStep] = useState(0);
  const history = useHistory();
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      shippingMethod: "agency-ghn",
      isInVietNam: false,
    },
    resolver: yupResolver(checkoutSchema),
  });
  const { handleSubmit } = methods;
  function onSubmit(data) {
    console.log(data);
  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="steps">
            <span onClick={() => history.push("/cart")}>Cart</span>
            <span className={step === 0 ? "activeStep" : ""}>Information</span>
            <span className={step === 1 ? "activeStep" : ""}>Shipping</span>
            <span className={step === 2 ? "activeStep" : ""}>Payment</span>
          </div>
          <UseForm stepState={[step, setStep]} />
        </form>
      </FormProvider>
    </>
  );
};

export default CheckoutForm;
