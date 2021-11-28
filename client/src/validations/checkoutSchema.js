import * as yup from "yup";

yup.addMethod(yup.object, "atLeastOneOf", function (list) {
  return this.test({
    name: "atLeastOneOf",
    message: "You must provide at least one contact detail",
    exclusive: true,
    params: { keys: list.join(", ") },
    test: (value) => value === "" || list.some((f) => value[f] !== ""),
  });
});

const checkoutSchema = yup
  .object()
  .shape({
    phoneNumber: yup.string(),
    email: yup.string().email("Invalid email"),
    address: yup.string().required("Address is required"),
  })
  .atLeastOneOf(["phoneNumber", "email"]);
export default checkoutSchema;
