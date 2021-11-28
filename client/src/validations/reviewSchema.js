import * as yup from "yup";

const reviewSchema = yup.object().shape({
  ratingContent: yup.string().max(100, "Viet it thoi"),
});

export default reviewSchema;
