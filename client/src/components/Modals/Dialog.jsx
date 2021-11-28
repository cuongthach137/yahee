import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    gap: "2rem",
  },
});

export default function ResponsiveDialog({
  open,
  handleState,
  message,
  title = "Confirmation Needed",
  setConfirm,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => handleState("closeDialog")}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions className={classes.root}>
          <Button
            onClick={() => {
              handleState("closeDialog");
              setConfirm(true);
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
          <Button
            autoFocus
            onClick={() => {
              handleState("closeDialog");
              setConfirm(false);
            }}
            color="primary"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
