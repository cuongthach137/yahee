import * as yup from "yup";

const createProductSchema = yup.object().shape({
  title: yup.string().required("Product must have a title"),
  brief: yup.string().required("Product must have a brief description"),
  description: yup.string(),
  images: yup.array().max(10, "Maximum number of images allowed is 10"),
  thumbnail: yup.object().shape({
    public_id: yup.string(),
    url: yup.string(),
  }),
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
  category: yup.string().required("Product must belong to a category"),
  subCategory: yup.string().required("Product must belong to a subCategory"),
  price: yup
    .number("Price must be a number")
    .min(1, "Price must be greater than 1")
    .required("Product must have a price"),
  quantity: yup
    .number()

    .required("Product must have quantity"),

  details: yup.object().shape({
    producer: yup.string(),
    plantType: yup.string(),
    growMethod: yup.string(),
    growRegion: yup.string(),
    terpenes: yup.string(),
    dryingMethod: yup.string(),
    thc_content: yup.array().required(),
    cbd_content: yup.array().required(),
    brand: yup.string(),
  }),
});

export default createProductSchema;
