const { withStyles, TextField } = require("@material-ui/core");

const StyledInput = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "green",
    },
    "& .MuiInputBase-input": {
      padding: "15.5px 14px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "green",
      },
    },
  },
})(TextField);

export default StyledInput;
