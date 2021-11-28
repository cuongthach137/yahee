import { Tooltip } from "@material-ui/core";
import React from "react";
import tooltip from "../../constants/tooltip";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import SlickSlider from "../Slider/SlickSlider";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 250,
  },
}));
const ImageGallery = ({ product }) => {
  const classes = useStyles();
  return (
    <>
      <div className="product__details__body__image_gallery">
        <ul className="product__details__body__image_gallery-properties">
          <li className="product__details__body__image_gallery-properties-type">
            <p>THC</p>
            <span className="product__details__body__image_gallery-properties-type-tool-tip">
              <Tooltip
                classes={{ tooltip: classes.customWidth }}
                TransitionComponent={Fade}
                title={tooltip.thc_content}
                placement="left"
                arrow
              >
                <HelpOutlineOutlinedIcon />
              </Tooltip>
            </span>
            {product.details.thc_content.length > 0 ? (
              <>
                {" "}
                <p>
                  {product.details.thc_content[0]?.toFixed(2)} -{" "}
                  {(product.details.thc_content[1] / 10)?.toFixed(2)} %
                </p>
                <p>
                  {product.details.thc_content[0]?.toFixed(2)} -{" "}
                  {product.details.thc_content[1]?.toFixed(2)} mg/g
                </p>
              </>
            ) : (
              <p>Not Specified</p>
            )}
          </li>
          <li className="product__details__body__image_gallery-properties-type">
            <p>CBD</p>
            <span className="product__details__body__image_gallery-properties-type-tool-tip">
              <Tooltip
                classes={{ tooltip: classes.customWidth }}
                TransitionComponent={Fade}
                title={tooltip.cbd_content}
                placement="left"
                arrow
              >
                <HelpOutlineOutlinedIcon />
              </Tooltip>
            </span>
            {product.details.cbd_content.length > 0 ? (
              <>
                <p>
                  {product.details.cbd_content[0]?.toFixed(2)} -{" "}
                  {(product.details.cbd_content[1] / 10)?.toFixed(2)} %
                </p>
                <p>
                  {product.details.cbd_content[0]?.toFixed(2)} -{" "}
                  {product.details.cbd_content[1]?.toFixed(2)} mg/g
                </p>
              </>
            ) : (
              <p>Not Specified</p>
            )}
          </li>
          <li className="product__details__body__image_gallery-properties-type">
            <p>Plant Type</p>
            <span className="product__details__body__image_gallery-properties-type-tool-tip">
              <Tooltip
                classes={{ tooltip: classes.customWidth }}
                TransitionComponent={Fade}
                title={tooltip["plant-type"]}
                placement="left"
                arrow
              >
                <HelpOutlineOutlinedIcon />
              </Tooltip>
            </span>
            <p>{product.details.plantType}</p>
          </li>
        </ul>
        <div className="product__details__body__image_gallery-slider">
          <SlickSlider images={product.images} />
        </div>
      </div>
    </>
  );
};

export default ImageGallery;
