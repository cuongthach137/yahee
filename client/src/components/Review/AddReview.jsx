import React, { useContext, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import Rating from "@material-ui/lab/Rating";

import "./AddReview.styles.scss";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { addRating } from "../../functions/userFunctions";
import reviewSchema from "../../validations/reviewSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { ProgressContext } from "../../contexts/ProgressContext";

import TextField from "../../styles/override/TextField";
const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const useStyles = makeStyles({
  root: {
    margin: "2rem 0px",
    width: 200,
    display: "flex",
    alignItems: "center",
  },
});

const config = {
  mode: "onChange",
  resolver: yupResolver(reviewSchema),
};

const AddReview = ({ slug, mode, userRating }) => {
  const [progress, setProgress] = useContext(ProgressContext);

  const methods = useForm({
    ...config,
    defaultValues: {
      star: 5,
      ratingContent: "",
    },
    yupResolver,
  });
  const {
    formState: { isSubmitSuccessful, isValid, errors },
    reset,
    control,
    getValues,
  } = methods;
  const { setValue, handleSubmit } = methods;
  const [star, setStar] = React.useState(5);
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();
  async function onSubmit(data) {
    const accessToken = localStorage.getItem("accessToken");
    setProgress(true);
    try {
      const response = await addRating(slug, data, accessToken);
      toast.success(
        `${response.data.message}. Thank you for giving us your honest thought!`
      );

      setProgress(false);
    } catch (err) {
      console.log(err);
      setProgress(false);
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setValue("ratingContent", "");
    }
  }, [methods.formState, isSubmitSuccessful, reset, setValue]);
  return (
    <div className="add-review__container">
      {mode === "add" ? <h3>Add a review</h3> : <h3>Edit your review</h3>}
      <div className={classes.root}>
        <Rating
          name="hover-feedback"
          value={star}
          precision={0.5}
          onChange={(_, newValue) => {
            setStar(newValue);
            setValue("star", newValue);
          }}
          onChangeActive={(_, newHover) => {
            setHover(newHover);
          }}
        />
        {star !== null && (
          <Box ml={2}>{labels[hover !== -1 ? hover : star]}</Box>
        )}
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="add-review__edit-box"
        >
          <Controller
            name="ratingContent"
            control={control}
            defaultValue={userRating || ""}
            render={({ field }) => (
              <div style={{ position: "relative" }}>
                <TextField
                  multiline
                  minRows={4}
                  maxRows={4}
                  fullWidth
                  disabled={progress}
                  margin="normal"
                  variant="outlined"
                  error={!!errors.ratingContent}
                  {...field}
                />
                <p
                  style={{
                    color: isValid ? "green" : "red",
                    bottom: "10%",
                    right: "2%",
                    position: "absolute",
                  }}
                >
                  {getValues("ratingContent")
                    ? getValues("ratingContent").length
                    : 0}
                  /100
                </p>
              </div>
            )}
          />
          <button
            disabled={!isValid && progress}
            type="submit"
            style={{ marginTop: "2rem" }}
            className={`btn primary-btn bouncy ${
              isValid && !progress ? null : "disabled"
            }`}
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddReview;
