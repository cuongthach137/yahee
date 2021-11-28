import React from "react";
import Form from "../../components/Forms/Form";
import "./Register.styles.scss";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Input from "../../components/Forms/Input";
import registerSchema from "../../validations/registerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@material-ui/core";
import useAuthentication from "../../customHooks/useAuthentication";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PasswordInput from "../../components/Forms/PasswordInput";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { motion } from "framer-motion";

const config = {
  mode: "onChange",
  resolver: yupResolver(registerSchema),
};
const Register = () => {
  const { register } = useAuthentication();
  const { isLoading } = useSelector((state) => state.user);
  const methods = useForm({ ...config });
  const {
    register: reg,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = methods;
  function onSubmit(data) {
    const { confirm, ...rest } = data;
    try {
      register(rest);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="register">
      <div className="backBtn">
        <ArrowBackIosIcon /> <Link to="/">Go To Home</Link>
      </div>
      <div className="container">
        <motion.div
          animate={{ x: 0 }}
          initial={{ x: 200 }}
          exit={{ x: 300 }}
          className="register-panel"
        >
          <div className="social-login">
            <div className="button">
              <button>Sign up with Facebook</button>
              <button> Sign up with Twitter</button>
            </div>
            <span>Or</span>
          </div>
          <div className="title">
            <h1>Sign Up</h1>
            <p>Join us - Register now for FREE</p>
            <p>
              Already a member?
              <Link to="/auth/login">
                {" "}
                <span>Log in</span>
              </Link>
            </p>
          </div>
          <div className="register-form">
            <FormProvider {...methods}>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-fields">
                  <Input
                    ref={reg("name")}
                    name="name"
                    type="text"
                    size="small"
                    margin="none"
                    label="Username *"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                  />
                  <Input
                    ref={reg("email")}
                    name="email"
                    type="email"
                    size="small"
                    margin="none"
                    label="Email *"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                  />
                  <PasswordInput name="password" label="Password *" />
                  <PasswordInput
                    name="passwordConfirmation"
                    label="Confirm Password"
                  />
                </div>
                <div className="capcha"> </div>
                <div className="actions">
                  <p className="agree">
                    <Controller
                      control={control}
                      name="confirm"
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          defaultChecked
                          color="primary"
                          inputProps={{
                            "aria-label": "confirm agreement to terms",
                          }}
                        />
                      )}
                    />
                    <span>
                      I agree to the <strong> terms </strong> and
                      <strong> conditions</strong>
                    </span>
                  </p>
                  <div className="submit">
                    <button
                      disabled={!isValid || isLoading}
                      className={`btn bouncy ${isValid ? "" : "disabled"} `}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </Form>
            </FormProvider>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
