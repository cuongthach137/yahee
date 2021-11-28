import * as yup from "yup";

const userInfoSchema = yup.object().shape({
  name: yup
    .string()
    .matches(
      /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Name must not contain any special characters, blank space"
    )
    .required("Name can't be left blank"),
});

export default userInfoSchema;
