import * as yup from "yup";

const userInfoSchema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      "Your password pust contain 6 characters, one uppercase, one lowercase, one number and one special case character"
    )
    .required("New password is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Password doesn't match"),
});

export default userInfoSchema;
