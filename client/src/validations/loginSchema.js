import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().required("Please enter your email"),
  password: yup.string().required("Please enter your password"),
  keep: yup.bool(),
});

export default loginSchema;
