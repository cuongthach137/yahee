import * as yup from "yup";

const updateProductSchema = yup.object().shape({
  title: yup.string().min(1, "Remove the field ").ensure(),
  brief: yup.string().ensure(),
  description: yup.string().ensure(),
  images: yup.array().max(10, "Maximum number of images allowed is 10"),
  size: yup
    .array()
    .of(yup.number())
    .max(
      5,
      `Product may have at most 5 different sizes, remove some to proceed`
    ),
  discount: yup
    .array()
    .of(yup.number())
    .max(3, `Product may have a maximum of 3 discount levels`),
  category: yup.string().ensure(),
  subCategory: yup.string().ensure(),
  price: yup
    .number("Price must be a number")
    .min(1, "Price must be greater than 1"),
  quantity: yup.number().min(1, "Price must be greater than 1"),
  details: yup.object().shape({
    producer: yup.string().ensure(),
    plantType: yup.string().ensure(),
    growMethod: yup.string().ensure(),
    growRegion: yup.string().ensure(),
    terpenes: yup.string().ensure(),
    dryingMethod: yup.string().ensure(),
    thc_content: yup.array().ensure(),
    cbd_content: yup.array().ensure(),
    brand: yup.string().ensure(),
  }),
});

export default updateProductSchema;
