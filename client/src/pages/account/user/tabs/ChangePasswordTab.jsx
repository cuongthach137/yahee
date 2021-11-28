import { yupResolver } from "@hookform/resolvers/yup";
import { Card } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PasswordInput from "../../../../components/Forms/PasswordInput";
import { ProgressContext } from "../../../../contexts/ProgressContext";
import useAuthentication from "../../../../customHooks/useAuthentication";
import userChangePasswordSchema from "../../../../validations/userChangePasswordSchema";
import "./ChangePasswordTab.styles.scss";
const config = {
  mode: "onBlur",
  resolver: yupResolver(userChangePasswordSchema),
};
const ChangePasswordTab = () => {
  const [progress] = useContext(ProgressContext);
  const { hasError, isLoading } = useSelector((state) => state.user);
  const methods = useForm({
    ...config,
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
  });
  const { handleSubmit, reset } = methods;
  const { changePassword } = useAuthentication();

  function onSubmit(data) {
    changePassword(data);
  }
  useEffect(() => {
    if (!hasError && !isLoading) {
      reset();
      console.log("hello");
    }
  }, [hasError, reset, isLoading]);
  console.log(hasError);
  return (
    <div className="changePasswordTab">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card classes={{ root: "lmao" }}>
            <div className="passwordFields">
              <PasswordInput name="oldPassword" label="Old Password" />
              <PasswordInput name="newPassword" label="New Password" />
              <PasswordInput
                name="passwordConfirmation"
                label="Confirm Password"
              />
            </div>
            <button
              disabled={progress}
              type="submit"
              className={`btn updatePasswordBtn  ${
                progress ? "disabled" : "primary-btn bouncy"
              }`}
            >
              Update
            </button>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

export default ChangePasswordTab;
