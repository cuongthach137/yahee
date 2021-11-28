import React, { useContext, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useHistory } from "react-router";
import Input from "../Forms/Input";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import "./UserInformation.styles.scss";
import axios from "axios";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import AutoComplete from "../../styles/override/AutoComplete";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import delayedTransition from "../../functions/delayedTransition";
import { ProgressContext } from "../../contexts/ProgressContext";
import useAuthentication from "../../customHooks/useAuthentication";

const UserInformation = ({ next }) => {
  const [addressApi, setAddressApi] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [checked, setChecked] = useState(false);
  const [save, setSave] = useState(false);
  const history = useHistory();
  const setProgress = useContext(ProgressContext)[1];
  const { update, isAuthenticated } = useAuthentication();
  const { whereabouts, email, phoneNumber, firstName, lastName } = useSelector(
    (state) => (state.user.user ? state.user.user : {})
  );

  const { country, city, district, zipCode, address, state } =
    whereabouts || {};
  const {
    formState: { errors },
    getValues,
    setValue,
    control,
    trigger,
  } = useFormContext();

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=2"
      );
      setAddressApi(response.data);
    })();
    setChecked(getValues("isInVietNam"));
  }, [getValues]);
  return (
    <div className="userInformation">
      <div className="contactInfo">
        <h2>Contact Information</h2>
        <div className="stack">
          <Input
            name="email"
            type="email"
            label="Email"
            defaultValue={isAuthenticated ? email : getValues("email")}
          />{" "}
          <Input
            name="phoneNumber"
            type="tel"
            label="Phone"
            defaultValue={
              isAuthenticated ? phoneNumber : getValues("phoneNumber")
            }
          />
        </div>
      </div>
      <div className="shippingAddress">
        <h2>Shipping Address</h2>
        <div className="stack">
          <Input
            name="firstName"
            label="First name"
            defaultValue={isAuthenticated ? firstName : getValues("firstName")}
          />
          <Input
            name="lastName"
            label="Last Name"
            defaultValue={isAuthenticated ? lastName : getValues("lastName")}
          />
        </div>{" "}
        {!isAuthenticated && (
          <div className="stack checkCountry">
            {" "}
            <span></span>{" "}
            <Controller
              control={control}
              name="isInVietNam"
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      defaultChecked={getValues("isInVietNam")}
                      onChange={(_, value) => {
                        setValue("isInVietNam", value);
                        setValue("country", "Việt Nam");
                        setChecked(value);
                      }}
                      color="primary"
                    />
                  }
                  label="Are you in Viet Nam?"
                />
              )}
            />
          </div>
        )}
        {checked && (
          <>
            {" "}
            <div className="stack">
              <Controller
                control={control}
                name="city"
                defaultValue={getValues("city")}
                render={({ field }) => (
                  <AutoComplete
                    disableClearable
                    id="city"
                    options={addressApi}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(_, city) => {
                      setValue("city", city);
                      setDistricts(city.districts);
                    }}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    defaultValue={getValues("city")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="City"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.city}
                        helperText={errors?.city?.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="district"
                defaultValue={getValues("district")}
                render={(field) => (
                  <AutoComplete
                    disableClearable
                    id="district"
                    options={districts}
                    getOptionLabel={(option) => option.name || ""}
                    onChange={(_, district) => {
                      setValue("district", district);
                    }}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    defaultValue={getValues("district")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...field}
                        label="District"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.district}
                        helperText={errors?.district?.message}
                      />
                    )}
                  />
                )}
              />
            </div>
          </>
        )}
        {console.log(typeof getValues("city") === "object")}
        {!checked && (
          <>
            <div className="stack">
              <Input
                name="country"
                label="Country"
                defaultValue={isAuthenticated ? country : getValues("country")}
              />
              <Input
                name="city"
                label="City"
                defaultValue={
                  isAuthenticated
                    ? city
                    : typeof getValues("city") === "object"
                    ? getValues("city").name
                    : getValues("city")
                }
              />
            </div>
            <Input
              name="district"
              label="District"
              defaultValue={
                isAuthenticated
                  ? district
                  : typeof getValues("district") === "object"
                  ? getValues("district").name
                  : getValues("district")
              }
            />
            <div className="stack">
              <Input
                name="state"
                label="State"
                defaultValue={isAuthenticated ? state : getValues("state")}
              />
              <Input
                name="zipCode"
                label="Zip Code"
                defaultValue={isAuthenticated ? zipCode : getValues("zipCode")}
              />
            </div>
          </>
        )}
        <Input
          name="address"
          label="Address"
          defaultValue={isAuthenticated ? address : getValues("address")}
        />
        {isAuthenticated && (
          <div>
            <Checkbox
              color="primary"
              checked={save}
              onChange={(e) => setSave(e.target.checked)}
            />
            <span>Save this address to your account</span>
          </div>
        )}
      </div>
      <div className="buttonGroup">
        <div onClick={() => history.push("/cart")}>
          <span>
            <ArrowBackOutlinedIcon />
          </span>
          <span> Return to your cart</span>
        </div>
        <button
          className="btn primary-btn"
          onClick={async () => {
            const vals = [
              "firstName",
              "lastName",
              "country",
              "phoneNumber",
              "district",
              "state",
              "zipCode",
              "address",
              "city",
            ];
            const infoArray = getValues(vals);
            const userInfo = {};
            for (let i = 0; i < infoArray.length; i++) {
              if (infoArray[i]) {
                userInfo[vals[i]] = infoArray[i];
              }
            }
            const result = await trigger();
            if (!result)
              return errors[`${""}`]
                ? toast.error(`${errors[`${""}`]?.message}`)
                : undefined;
            if (save) {
              update(userInfo);
              delayedTransition([() => next()], setProgress);
            } else {
              delayedTransition([() => next()], setProgress);
            }
          }}
        >
          Proceed to shipping options
        </button>
      </div>
    </div>
  );
};

export default UserInformation;
