import { LinearProgress, withStyles } from "@material-ui/core";

const styledProgress = withStyles((theme) => ({
  colorPrimary: {
    backgroundColor: "#559157",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#9ac587",
  },
}))(LinearProgress);

export default styledProgress;
