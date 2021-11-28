import React, { useContext, useState } from "react";
import {
  LoadingContext,
  ProgressContext,
} from "../../contexts/ProgressContext";
import { Controller } from "react-hook-form";
import Dropzone from "react-dropzone";
import Paper from "@material-ui/core/Paper";
import CloudUpload from "@material-ui/icons/CloudUpload";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Resizer from "react-image-file-resizer";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";
import Skeleton from "@material-ui/lab/Skeleton";
import StarRateIcon from "@material-ui/icons/StarRate";
import { removeImage, uploadImage } from "../../functions/imageFunctions";

const useStyles = makeStyles({
  root: {
    backgroundColor: "transparent",
    textAlign: "center",
    cursor: "pointer",
    color: "#333",
    padding: "10px",
    height: "10rem",
  },
  icon: {
    marginTop: "16px",
    color: "#888",
    fontSize: "42px",
  },
  removeIcon: {
    color: "#bbbbbb",
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
    cursor: "pointer",
    borderRadius: "50%",
    "&:hover": {
      opacity: "0.7",
    },
    "&:hover .makeThumb ": {
      display: "block",
    },
  },
  skele: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "1em",
    height: "1em",
  },
  marked: {
    position: "absolute",
    left: "35%",
    transform: "translateY(-135%) scale(1.5)",
  },

  makeThumbnail: {
    display: "none",
    position: "absolute",
    left: "35%",
    transform: "translateY(-135%)",
  },
  listItemImg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
});

const FilesInput = ({
  control,
  name,
  setValue,
  getValues,
  setImages,
  images,
  numb,
  setNumb,
}) => {
  const setProgress = useContext(ProgressContext)[1];
  const [loading, setLoading] = useContext(LoadingContext);
  const styles = useStyles();
  const [thumb, setThumb] = useState("");
  function handleImages(files, setValues) {
    const uploadedImages = images ?? [];
    if (files) {
      setLoading(true);
      setProgress(true);
      setNumb(numb + files.length);

      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(files[i], 720, 720, "JPEG", 100, 0, (uri) => {
          uploadImage(uri)
            .then((res) => {
              uploadedImages.push(res.data);
              setLoading(false);
              setProgress(false);
              setImages && setImages([...uploadedImages]);
              setValues([...uploadedImages]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    }
  }

  function handleRemoveImage(file, index) {
    setProgress(true);
    setNumb((numb) => numb - 1);
    const data = getValues("images");
    const { public_id } = data[index];
    removeImage(public_id).then((res) => {
      setValue(
        "images",
        data.filter((item) => item.public_id !== public_id)
      );
      setImages &&
        setImages(data.filter((item) => item.public_id !== public_id));
      setProgress(false);
    });
  }
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field }) => (
        <>
          <List className={styles.list}>
            {loading
              ? Array(numb)
                  .fill("")
                  .map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "5rem",
                        height: "5rem",
                        position: "relative",
                      }}
                    >
                      <Skeleton
                        className={styles.listItem}
                        animation={loading ? "pulse" : false}
                        variant="circle"
                        style={{ width: "5rem", height: "5rem" }}
                      />
                      <Skeleton
                        className={styles.skele}
                        animation={"pulse"}
                        variant="circle"
                        width={10}
                        height={10}
                      />
                    </div>
                  ))
              : field.value &&
                field.value.map((f, i) => (
                  <ListItem className={styles.listItem} key={i}>
                    <span className={`${styles.makeThumbnail} makeThumb`}>
                      <StarRateIcon color="error" />
                    </span>
                    {thumb === f.public_id && (
                      <span className={styles.marked}>
                        <StarRateIcon color="error" />
                      </span>
                    )}
                    <img
                      onClick={() => {
                        setValue("thumbnail", f);
                        setThumb(f.public_id);
                      }}
                      className={styles.listItemImg}
                      src={f.url}
                      alt={f.public_id}
                    />
                    <span
                      onClick={() => {
                        handleRemoveImage(f, i);
                        if (thumb === f.public_id) {
                          setValue("thumbnail", {});
                          setThumb("");
                        }
                      }}
                      className="remove-btn"
                    >
                      <HighlightOffOutlinedIcon className={styles.removeIcon} />
                    </span>
                  </ListItem>
                ))}
          </List>
          <Dropzone
            maxFiles={10}
            onDrop={(e) => {
              handleImages(e, field.onChange);
            }}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <Paper
                className={styles.root}
                {...getRootProps()}
                variant="outlined"
              >
                <CloudUpload className={styles.icon} />
                <input {...getInputProps()} name={name} onBlur={field.onBlur} />
                {isDragActive ? (
                  <p>Drop here!!</p>
                ) : (
                  <p>Drag 'n' drop here, or click to select</p>
                )}
              </Paper>
            )}
          </Dropzone>
        </>
      )}
    />
  );
};

export default FilesInput;
