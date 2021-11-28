import * as yup from "yup";

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Name must not contain any special characters, blank space"
    )
    .required("Please enter a username"),
  email: yup.string().required("Please enter your email"),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      "Your password pust contain 6 characters, one uppercase, one lowercase, one number and one special case character"
    )
    .required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password doesn't match"),
  confirm: yup
    .bool()
    .oneOf([
      true,
      "To become a member, you must agree to our terms and conditions",
    ]),
});

export default registerSchema;
