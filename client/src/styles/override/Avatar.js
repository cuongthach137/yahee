import AvatarGroup from "@material-ui/lab/AvatarGroup";

const { withStyles } = require("@material-ui/core");

const StyledInput = withStyles({
  root: {
    alignItems: "center",
    height: "4rem",
    "&>.MuiAvatar-root:last-child": {
      transform: "translate(-5px,-8px)",
      fontSize: "10px",
    },
    "&>.MuiAvatar-root:first-child": {
      transform: "translate(0px, 8px)",

      border: "2px solid #fff",
    },
  },
})(AvatarGroup);

export default StyledInput;
