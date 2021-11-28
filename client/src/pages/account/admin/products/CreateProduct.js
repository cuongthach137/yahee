import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import createProductSchema from "../../../../validations/createProductSchema";
import "./CreateProduct.styles.scss";

//local components
import Form from "../../../../components/Forms/Form";
import Input from "../../../../components/Forms/Input";
import FilesInput from "../../../../components/Forms/FilesInput";
import SlickSliderp from "../../../../components/Slider/SlickSliderP";
import PriceTable from "../../../../components/CreateProduct/PriceTable";
import RangeSlider from "../../../../components/Forms/RangeSlider";

//functions
import { getCategories } from "../../../../functions/categoryFunctions";
import { getSubCategoriesByParent } from "../../../../functions/subCategoryFunctions";
import { createProduct } from "../../../../functions/productFunctions";
import { removeImage } from "../../../../functions/imageFunctions";
import findColor from "../../../../functions/findColor";
import productDetails from "../../../../constants/productDetails";

//material ui
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/styles";
import { TextField } from "@material-ui/core";

//overrides
import Autocomplete from "../../../../styles/override/AutoComplete";

//state related
import {
  LoadingContext,
  ProgressContext,
} from "../../../../contexts/ProgressContext";
import { toast } from "react-toastify";

const config = {
  mode: "onBlur",
  resolver: yupResolver(createProductSchema),
};
const useStyles = makeStyles({
  skele: {
    width: "100%",
    height: "20em",
  },
});

const CreateProduct = () => {
  const methods = useForm({
    ...config,
    defaultValues: {
      images: [],
      size: [],
      discount: [0],
    },
  });
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = methods;
  const styles = useStyles();
  const [loading] = useContext(LoadingContext);
  const setProgress = useContext(ProgressContext)[1];
  const [numb, setNumb] = useState(0);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCates, setSubCates] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null);
  const [pote, setPote] = useState("");
  const sizes = useRef([]);
  const [newSize, setNewSize] = useState(undefined);
  const discounts = useRef([0]);
  const [newDiscount, setNewDiscount] = useState(undefined);
  const [details, setDetails] = useState([]);
  const [isReset, setIsReset] = useState(false);
  const [categoryKey, setCategoryKey] = useState("category");
  const [detailKey, setDetailKey] = useState("details");
  const [subCategoryKey, setSubCategoryKey] = useState("subcategory");
  function addSizeOrDiscount(whatArray, newWhat, what, setWhat) {
    const repeated = whatArray.current.find((i) => i === newWhat);
    if (!repeated && newWhat && newWhat > 0) {
      whatArray.current.push(parseInt(newWhat).toFixed(2));
      setValue(what, whatArray.current);
      setWhat("");
    }
    return setWhat("");
  }

  const resetAll = useCallback(
    (removeImages = false) => {
      setProgress(true);
      if (removeImages) {
        for (let i = 0; i < images.length; i++) {
          removeImage(images[i].public_id).then((_res) => {
            setProgress(false);
          });
        }
      }
      setSubCategoryKey(Math.random());
      setCategoryKey(Math.random());
      setDetailKey(Math.random());
      const detailsToReset = {};
      details.forEach(
        (detail) => (detailsToReset[`details.${detail.code}`] = "")
      );
      reset({
        title: "",
        brief: "",
        description: "",
        category: "",
        subCategory: "",
        brand: "",
        size: [],
        images: [],
        discount: [0],
        price: "",
        quantity: "",
        producer: "",
        ...detailsToReset,
      });

      setValue("details.thc_content", [0, 0]);
      setValue("details.cbd_content", [0, 0]);
      setIsReset((isReset) => !isReset);
      setDetails([]);
      setImages([]);
      setNumb(0);
      setSubCates([]);
      setPote("");
      setProgress(false);
    },
    [reset, images, setProgress, setValue, details]
  );
  function onSubmit(data) {
    const accessToken = window.localStorage.getItem("accessToken");

    setProgress(true);
    createProduct(data, accessToken)
      .then(() => {
        setProgress(false);
        toast.success("Product added successfully");
      })
      .catch((err) => toast.success("Something went wrong: " + err.message));
  }

  useEffect(() => {
    if (methods.formState.isSubmitSuccessful) {
      resetAll();
    }
  }, [methods.formState, reset, resetAll]);
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res.data.categories);
    });
  }, [methods.formState.isSubmitSuccessful, isReset]);
  useEffect(() => {
    if (selectedCate) {
      getSubCategoriesByParent(selectedCate).then((res) => {
        setSubCates(res.data.subCategories);
      });
    }
  }, [selectedCate]);
  return (
    <div className="createProduct">
      <div className="createForm">
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {sizes.current && sizes.current.length > 0 && (
              <PriceTable
                discount={getValues("discount")}
                size={getValues("size")}
                price={getValues("price")}
              />
            )}
            <div className="productImages">
              <div className="productImages__images">
                <div className="images-preview">
                  <div className="images-preview__thumbnail">
                    {loading ? (
                      <Skeleton
                        className={styles.skele}
                        animation={"pulse"}
                        variant="rect"
                      />
                    ) : (
                      images &&
                      images.length > 0 && (
                        <SlickSliderp images={images} dots={false} />
                      )
                    )}
                  </div>
                </div>
                <div className="images-dropzone">
                  <FilesInput
                    getValues={getValues}
                    setValue={setValue}
                    name="images"
                    images={images}
                    control={control}
                    setImages={setImages}
                    numb={numb}
                    setNumb={setNumb}
                  />
                </div>
              </div>
            </div>
            <div className="productInfo">
              <Input name="title" label="Title *" />
              <Input name="brief" label="Brief *" />
              <Input
                multiline
                minRows={5}
                maxRows={5}
                name="description"
                type="text"
                label="Description *"
              />
              <div className="productInfo__category">
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        key={categoryKey}
                        disableClearable
                        onChange={(_, newValue) => {
                          setSelectedCate(newValue._id);
                          setValue("category", newValue._id, {
                            shouldValidate: true,
                          });
                        }}
                        id="categories"
                        options={categories}
                        getOptionLabel={(option) => option.name.toUpperCase()}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              label="Categories *"
                              variant="outlined"
                              fullWidth
                              {...field}
                              margin="normal"
                              error={!!errors.category}
                              helperText={errors?.category?.message}
                            />
                          );
                        }}
                      />
                    );
                  }}
                />
              </div>
              <div className="productInfo__subCategory">
                <Controller
                  control={control}
                  name="subCategory"
                  render={({ field }) => {
                    return (
                      <Autocomplete
                        key={subCategoryKey}
                        disableClearable
                        onChange={(event, newValue) => {
                          field.onChange(newValue._id);
                        }}
                        id="subCategories"
                        options={subCates}
                        getOptionLabel={(option) => option.name.toUpperCase()}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...field}
                              {...params}
                              label="Subcategories *"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              error={!!errors.subCategory}
                              helperText={errors?.subCategory?.message}
                            />
                          );
                        }}
                      />
                    );
                  }}
                />
              </div>
              <Input name="price" label="Price *" step={0.1} adornment={true} />
              <Input name="quantity" type="number" label="Quantity *" />

              <div className="productInfo__size__discount">
                <div
                  className={`productInfo__size__discount__input ${
                    sizes.current.length > 4 ? "disabled" : ""
                  }`}
                >
                  <span
                    onClick={() =>
                      addSizeOrDiscount(sizes, newSize, "size", setNewSize)
                    }
                  >
                    Add size
                  </span>
                  <input
                    disabled={sizes.current.length > 4}
                    value={newSize}
                    type="number"
                    step={0.01}
                    onChange={(e) => {
                      e.target.value >= 0 && setNewSize(e.target.value);
                    }}
                  />
                </div>
                <div className="productInfo__size__discount__tags">
                  {sizes.current
                    .sort((a, b) => a - b)
                    .map((item, index) => (
                      <div
                        onClick={() => {
                          sizes.current = sizes.current.filter(
                            (i) => i !== item
                          );
                          setValue("size", sizes.current);
                          setNewSize([]);
                        }}
                        key={index}
                        className="btn tag-btn"
                      >
                        <span>{item}g</span>
                        <span>X</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="productInfo__size__discount">
                <div className="productInfo__size__discount__tags">
                  {discounts.current
                    .sort((a, b) => a - b)
                    .map((item, index) => (
                      <div
                        onClick={() => {
                          if (item === 0) return;
                          discounts.current = discounts.current.filter(
                            (i) => i !== item
                          );
                          setValue("discount", discounts.current);
                          setNewDiscount([]);
                        }}
                        key={index}
                        className="btn tag-btn"
                      >
                        {item === 0 ? <p>{item}</p> : <span>{item}%</span>}
                        {item === 0 ? "" : <span>X</span>}
                      </div>
                    ))}
                </div>
                <div
                  className={`productInfo__size__discount__input ${
                    discounts.current.length > 2 ? "disabled" : ""
                  }`}
                >
                  <span
                    onClick={() =>
                      addSizeOrDiscount(
                        discounts,
                        newDiscount,
                        "discount",
                        setNewDiscount
                      )
                    }
                  >
                    Add discount
                  </span>
                  <input
                    disabled={discounts.current.length > 2}
                    value={newDiscount}
                    type="number"
                    step={0.01}
                    onChange={(e) => {
                      e.target.value >= 0 && setNewDiscount(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="productDetails">
              <div className="potency">
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
                    setPote={setPote}
                  />
                  <RangeSlider
                    type="cbd_content"
                    step={0.1}
                    min={0}
                    max={100}
                    setPote={setPote}
                  />
                </div>
              </div>
              <Input name="producer" label="Producer" />
              <Input name="brand" label="Brand" />
              <Autocomplete
                key={detailKey}
                multiple
                id="productDetails"
                options={productDetails}
                onChange={(event, newValue) => {
                  setDetails(newValue);
                }}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    variant="filled"
                    margin="normal"
                    {...params}
                    label="Select to provide more details"
                    placeholder=""
                  />
                )}
              />
              {details &&
                details.length > 0 &&
                details
                  .sort((a, b) => a - b)
                  .map((item) => (
                    <div key={item.code}>
                      <Input
                        shouldUnregister={true}
                        name={`details.${item.code}`}
                        label={item.name}
                        error={!!errors[item.code]}
                        helperText={errors[item.code]?.message}
                      />
                    </div>
                  ))}
            </div>
            <div className="submitBar">
              <button
                type="button"
                onClick={() => {
                  resetAll(true);
                }}
                className="btn primary-btn"
              >
                Reset
              </button>
              <button
                disabled={!isValid}
                type="submit"
                className={`btn primary-btn ${isValid ? "" : "disabled"}`}
              >
                Create
              </button>
            </div>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateProduct;
