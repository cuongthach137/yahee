import React, { useCallback, useContext, useEffect, useState } from "react";

//components

//lib
import { useForm, FormProvider } from "react-hook-form";

//material ui
import { Fade, makeStyles, Modal, TextField } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Form from "../Forms/Form";
import Input from "../Forms/Input";
import FilesInput from "../Forms/FilesInput";
import { List, ListItem } from "@material-ui/core";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import { ProgressContext } from "../../contexts/ProgressContext";
import { removeImage } from "../../functions/imageFunctions";
import {
  updateProduct,
  updateProductImgs,
} from "../../functions/productFunctions";
import Autocomplete from "@material-ui/lab/Autocomplete";

import RangeSlider from "../Forms/RangeSlider";
import findColor from "../../functions/findColor";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    placeItems: "center",
    zIndex: "9999999",
  },
  editPanel: {
    width: "70vw",
    height: "50rem",
    backgroundColor: "#fff",
    position: "relative",
    overflowY: "auto",
    padding: "5rem",
  },
  closeBtn: {
    position: "absolute",
    right: "1rem",
    top: "1rem",
    zIndex: "20",
  },
  upload: {
    height: "20rem",
    padding: "1rem",
  },
  uploaded: {
    padding: "2rem",
    "& >h3": {
      marginBottom: "1rem",
    },
  },
  fields: {
    padding: "1rem",
  },
  list: {
    display: "flex",
    "flex-wrap": "wrap",
    gap: "1rem",
  },
  listItem: {
    width: "5rem",
    height: "5rem",
    padding: "0",
    borderRadius: "50%",
  },
  listItemImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  potency: {
    padding: "2rem",
    "& > .potency__header": {
      marginBottom: "1rem",
    },
    "& > .potency__content": {
      "&> div:first-child": {
        marginBottom: "2rem",
      },
    },
  },
  actions: {
    padding: "1rem",
  },
  form: {
    display: "flex",

    "flex-wrap": "wrap",
    "& > div": {
      width: "50%",
    },
  },
}));

const EditProduct = ({
  handleState,
  state,
  product,
  setIsEditing,
  isEditing,
}) => {
  const classes = useStyles();
  const [fields, setFields] = useState([]);
  const setProgress = useContext(ProgressContext)[1];
  const [numb, setNumb] = useState(0);
  const [images, setImages] = useState([]);
  const [pote, setPote] = useState("");
  const productDetails =
    isEditing &&
    Object.keys(product.details).filter(
      (i) => i !== "thc_content" && i !== "cbd_content" && i !== "potency"
    );
  const productInfo =
    isEditing &&
    Object.keys(product).filter(
      (i) =>
        i !== "details" &&
        i !== "_id" &&
        i !== "slug" &&
        i !== "category" &&
        i !== "subCategory" &&
        i !== "sold" &&
        i !== "createdAt" &&
        i !== "updatedAt" &&
        i !== "rating" &&
        i !== "__v" &&
        i !== "avgRating" &&
        i !== "images" &&
        i !== "discount" &&
        i !== "size"
    );
  const fieldsToEdit = isEditing ? [...productInfo, ...productDetails] : [];
  const methods = useForm();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitSuccessful, isValid },
  } = methods;

  function onSubmit(data) {
    console.log(data);
    const accessToken = window.localStorage.getItem("accessToken");
    setProgress(true);
    updateProduct(product._id, data, accessToken)
      .then((res) => {
        setProgress(false);
        setIsEditing(false);
        handleState("closeEdit");
      })
      .catch((err) => setProgress(false));
  }
  function handleRemoveImage(id) {
    const accessToken = window.localStorage.getItem("accessToken");
    setProgress(true);
    updateProductImgs(product._id, id, accessToken).then((res) => {
      removeImage(id).then(() => {
        setImages(images.filter((image) => image.public_id !== id));
        setProgress(false);
      });
    });
  }
  const resetAll = useCallback(() => {
    reset();
    setFields([]);
    setNumb(0);
    setImages([]);
  }, [reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      resetAll();
    }
  }, [isSubmitSuccessful, isValid, resetAll]);
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={state}
        className={classes.root}
        onClose={() => {
          handleState("closeEdit");
          setIsEditing(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={state}>
          <div className={classes.editPanel}>
            <button
              onClick={() => {
                handleState("closeEdit");
                setIsEditing(false);
                resetAll();
              }}
              className={`btn ${classes.closeBtn}`}
            >
              X
            </button>
            <div>
              <FormProvider {...methods}>
                {product && (
                  <Form
                    className={classes.form}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className={classes.images}>
                      <div className={classes.uploaded}>
                        <h3>
                          {product.images && product.images.length} Photos In
                          Database:
                        </h3>
                        <List className={classes.list}>
                          {product.images &&
                            product.images.length > 0 &&
                            product.images.map((img) => (
                              <ListItem
                                className={classes.listItem}
                                key={img.public_id}
                              >
                                <img
                                  className={classes.listItemImg}
                                  src={img.url}
                                  alt={img.public_id}
                                />
                                <span
                                  onClick={() => {
                                    handleRemoveImage(img.public_id);
                                  }}
                                  className="remove-btn"
                                >
                                  <HighlightOffOutlinedIcon />
                                </span>
                              </ListItem>
                            ))}
                        </List>
                      </div>
                      <div className={classes.upload}>
                        <h3>Photos to upload:</h3>
                        <FilesInput
                          getValues={getValues}
                          setValue={setValue}
                          name="images"
                          control={control}
                          numb={numb}
                          setNumb={setNumb}
                        />
                      </div>
                    </div>
                    <div className={classes.potency}>
                      <div className="potency__header">
                        Potency:{" "}
                        <strong style={{ color: findColor(pote) }}>
                          {pote.toUpperCase()}
                        </strong>
                      </div>
                      <div className="potency__content">
                        <RangeSlider
                          type="thc_content"
                          step={0.1}
                          min={0}
                          max={100}
                          mode="edit"
                          setPote={setPote}
                        />
                        <RangeSlider
                          type="cbd_content"
                          step={0.1}
                          min={0}
                          max={100}
                          mode="edit"
                          setPote={setPote}
                        />
                      </div>
                    </div>
                    <div className={classes.fields}>
                      <Autocomplete
                        multiple
                        id="productInfoDetails"
                        options={fieldsToEdit}
                        onChange={(event, newValue, reason) => {
                          setFields(newValue);
                        }}
                        clearOnBlur
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        renderInput={(params) => {
                          return (
                            <TextField
                              variant="filled"
                              margin="normal"
                              {...params}
                              label="Select Fields To Edit"
                              placeholder=""
                            />
                          );
                        }}
                      />
                      {isEditing &&
                        fields &&
                        fields.length > 0 &&
                        fields.map((item, index) => {
                          const info = productInfo.includes(item);

                          if (info) {
                            return (
                              <div key={item}>
                                <Input
                                  ref={register(`${item}`, {
                                    shouldUnregister: true,
                                  })}
                                  name={`${item}`}
                                  type="text"
                                  label={`${item}`}
                                  error={!!errors[item]}
                                  shouldUnregister={true}
                                  helperText={errors[item]?.message}
                                />
                              </div>
                            );
                          } else {
                            return (
                              <div key={item + index}>
                                <Input
                                  ref={register(`details.${item}`, {
                                    shouldUnregister: true,
                                  })}
                                  name={item}
                                  type="text"
                                  label={item}
                                />
                              </div>
                            );
                          }
                        })}
                    </div>
                    <div></div>
                    <div className={classes.actions}>
                      <button type="submit" className="btn">
                        Confirm
                      </button>
                    </div>
                  </Form>
                )}
              </FormProvider>
            </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default EditProduct;
