import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import "./SignIn.styles.scss";
import { useForm, FormProvider, Controller } from "react-hook-form";
import loginSchema from "../../validations/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@material-ui/core";
import Input from "../../components/Forms/Input";
import Form from "../../components/Forms/Form";
import useAuthentication from "../../customHooks/useAuthentication";
import delayedTransition from "../../functions/delayedTransition";
import { ProgressContext } from "../../contexts/ProgressContext";
import PasswordInput from "../../components/Forms/PasswordInput";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

const config = {
  mode: "onChange",
  resolver: yupResolver(loginSchema),
};
const SignIn = () => {
  const { login } = useAuthentication();
  const { isLoading } = useSelector((state) => state.user);
  const [progress, setProgress] = useContext(ProgressContext);
  const methods = useForm({
    ...config,
    defaultValues: {
      keep: true,
    },
  });
  const { handleSubmit, control } = methods;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  async function onSubmit(data) {
    delayedTransition([() => login(data)], setProgress);
  }
  return (
    <>
      <AnimatePresence>
        <div className="sign-in">
          <div className="backBtn">
            <ArrowBackIosIcon /> <Link to="/">Go To Home</Link>
          </div>
          <div className="container">
            <motion.div
              key="login"
              animate={{ x: 0 }}
              initial={{ x: 200 }}
              exit={{ x: 300 }}
              className="login-panel"
            >
              <div className="title">
                <h1>Login</h1>
                <p>Enter your email / Enter your password</p>
                <p>
                  Don't have an account?{" "}
                  <Link to="/auth/register">Register</Link>
                </p>
              </div>
              <div className="login-form">
                <FormProvider {...methods}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-fields">
                      <Input name="email" type="email" label="Email *" />
                      <PasswordInput name="password" label="Password *" />
                    </div>
                    <div className="submit">
                      <button
                        disabled={isLoading || progress}
                        type="submit"
                        className={`btn bouncy ${
                          isLoading || progress ? "disabled" : ""
                        }`}
                      >
                        Log in
                      </button>
                      <p className="keep">
                        <Controller
                          control={control}
                          name="keep"
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              defaultChecked
                              color="primary"
                              inputProps={{
                                "aria-label": "keep me logged in",
                              }}
                            />
                          )}
                        />
                        <span>Keep me logged in</span>
                      </p>
                    </div>
                  </Form>
                </FormProvider>
              </div>
              <div className="social-login">
                <div className="button">
                  <button>
                    <span>Sign up with Facebook</span>
                  </button>
                  <button>
                    <span>Sign up with Twitter</span>
                  </button>
                </div>
                <span>Or</span>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default SignIn;
