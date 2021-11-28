const { withStyles, Chip } = require("@material-ui/core");

const StyledInput = withStyles({
  root: {
    "&.MuiChip-colorPrimary": {
      backgroundColor: "#9ac587;",
    },
    "&.MuiChip-colorSecondary": {
      backgroundColor: "#dc3545",
    },
  },
})(Chip);

export default StyledInput;
