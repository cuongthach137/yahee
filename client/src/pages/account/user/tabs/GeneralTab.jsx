import React, { useCallback, useContext, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import AvatarUpload from "../../../../components/Forms/AvatarUpload";
import Resizer from "react-image-file-resizer";

import "./GeneralTab.styles.scss";
import { ProgressContext } from "../../../../contexts/ProgressContext";
import { removeImage, uploadImage } from "../../../../functions/imageFunctions";
import { Typography } from "@material-ui/core";
import Input from "../../../../components/Forms/Input";
import useAuthentication from "../../../../customHooks/useAuthentication";
import userInfoSchema from "../../../../validations/userInfoSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const config = {
  mode: "onBlur",
  resolver: yupResolver(userInfoSchema),
};

const GeneralTab = () => {
  const [progress, setProgress] = useContext(ProgressContext);
  const [avatar, setAvatar] = useState();
  const methods = useForm({ ...config });
  const {
    handleSubmit,
    setValue,

    getValues,
  } = methods;

  const { update, user } = useAuthentication();

  const { photo, email, name, whereabouts, phoneNumber, about } = user;
  const { address, city, state, country, zipCode, district } =
    whereabouts || {};

  //SUBMIT
  function onSubmit(data) {
    const filter = {};
    for (let i in data) {
      if (data[i]) {
        filter[i] = data[i];
      }
    }
    let finalData = {};
    for (let i in filter) {
      if (filter[i] !== user[i]) {
        finalData[i] = filter[i];
      }
    }
    console.log(finalData);
    if (Object.keys(finalData).length > 0) {
      update(finalData);
    }
  }

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      setProgress(true);
      const { public_id } = getValues("photo") || {};
      const { public_id: ownPhoto } = photo || {};
      if (public_id || ownPhoto) {
        await removeImage(public_id || ownPhoto);
        setProgress(false);
      }
      const file = acceptedFiles[0];
      if (file) {
        setProgress(true);
        Resizer.imageFileResizer(file, 720, 720, "JPEG", 100, 0, (uri) => {
          uploadImage(uri)
            .then((res) => {
              setProgress(false);
              setAvatar(URL.createObjectURL(file));
              setValue("photo", {
                public_id: res.data.public_id,
                url: res.data.url,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },
    [setValue, getValues, setProgress, photo]
  );
  return (
    <div className="generalTab">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item lg={4}>
              <Card
                classes={{ root: "lmao" }}
                sx={{ py: 10, px: 3, textAlign: "center" }}
              >
                <AvatarUpload
                  accept="image/*"
                  file={avatar}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  defaultPhoto={photo}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: "auto",
                        display: "block",
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of 3.1MB
                    </Typography>
                  }
                />
              </Card>
            </Grid>
            <Grid item lg={8}>
              <Card classes={{ root: "lmao" }}>
                <div className="account-info">
                  <div className="inputs">
                    <div className="stack">
                      <Input
                        name="name"
                        type="text"
                        label="Name"
                        defaultValue={name}
                      />
                      <Input
                        name="email"
                        type="email"
                        disabled={true}
                        defaultValue={email}
                      />
                    </div>
                    <div className="stack">
                      <Input
                        name="phoneNumber"
                        type="text"
                        label="Phone Number"
                        defaultValue={phoneNumber}
                      />{" "}
                      <Input
                        name="country"
                        type="text"
                        label="Country"
                        defaultValue={country}
                      />
                    </div>
                    <div className="stack">
                      <Input
                        name="city"
                        type="text"
                        label="City"
                        defaultValue={city}
                      />
                      <Input
                        name="state"
                        type="text"
                        label="State"
                        defaultValue={state}
                      />
                    </div>
                    <div className="stack">
                      <Input
                        name="district"
                        type="text"
                        label="District"
                        defaultValue={district}
                      />{" "}
                      <Input
                        name="zipCode"
                        type="text"
                        label="Zip/Code"
                        defaultValue={zipCode}
                      />
                    </div>{" "}
                    <Input
                      name="address"
                      type="text"
                      label="Address"
                      defaultValue={address}
                    />
                    <Input
                      name="about"
                      type="text"
                      label="About"
                      multiline
                      minRows={4}
                      maxRows={4}
                      defaultValue={about}
                    />
                  </div>
                  <button
                    disabled={progress}
                    type="submit"
                    className={`btn  ${
                      progress ? "disabled" : "primary-btn bouncy"
                    }`}
                  >
                    Update
                  </button>
                </div>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </div>
  );
};

export default GeneralTab;
