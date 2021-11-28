import Autocomplete from "@material-ui/lab/Autocomplete";

const { withStyles } = require("@material-ui/core");

const StyledAutoComplete = withStyles({
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
})(Autocomplete);

export default StyledAutoComplete;
