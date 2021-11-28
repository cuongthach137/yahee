import React from "react";

const ImageList = () => {
  return (
    <List className={styles.list}>
      {loading
        ? Array(numb)
            .fill("")
            .map((_, i) => (
              <div
                key={i}
                style={{
                  width: "10rem",
                  height: "10rem",
                  position: "relative",
                }}
              >
                <Skeleton
                  className={styles.listItem}
                  animation={loading ? "pulse" : false}
                  variant="circle"
                  style={{ width: "10rem", height: "10rem" }}
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
              <img
                className={styles.listItemImg}
                src={f.url}
                alt={f.public_id}
              />
              <span
                onClick={() => {
                  handleRemoveImage(f, i);
                }}
                className="remove-btn"
              >
                <HighlightOffOutlinedIcon />
              </span>
            </ListItem>
          ))}
    </List>
  );
};

export default ImageList;
