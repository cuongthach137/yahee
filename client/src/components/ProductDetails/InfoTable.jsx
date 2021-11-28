import { Tooltip } from "@material-ui/core";
import tooltip from "../../constants/tooltip";

import React from "react";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: 250,
  },
}));
const InfoTable = ({ product }) => {
  const classes = useStyles();
  const details = Object.keys(product.details);
  function showDataValue(value) {
    if (value === "thc_content" || value === "cbd_content") {
      if (product.details[value].length > 0) {
        return `${product.details[value][0]?.toFixed(2)} - ${product.details[
          value
        ][1]?.toFixed(2)}% | ${product.details[value][0]?.toFixed(2) * 10} - ${
          product.details[value][1]?.toFixed(2) * 10
        } mg/g `;
      } else return "none";
    } else return product.details[value];
  }
  return (
    <table className="product__details__in-depth__about__info-table">
      <tbody className="product__details__in-depth__about__info-table__body">
        {details
          .sort((a, b) => a - b)
          .map((detail) =>
            product.details[detail] && product.details[detail].length > 0 ? (
              <tr
                key={detail}
                className="product__details__in-depth__about__info-table__body__row"
              >
                <td className="product__details__in-depth__about__info-table__body__row__data">
                  <div>
                    <span>{detail} </span>
                    <Tooltip
                      classes={{ tooltip: classes.customWidth }}
                      TransitionComponent={Fade}
                      title={
                        tooltip[detail] ||
                        "No definition for this concept yet. We will add in later"
                      }
                      placement="left"
                      arrow
                    >
                      <HelpOutlineOutlinedIcon />
                    </Tooltip>
                  </div>
                </td>
                <td className="product__details__in-depth__about__info-table__body__row__data">
                  <div>
                    <span>{showDataValue(detail)} </span>
                  </div>
                </td>
              </tr>
            ) : null
          )}
      </tbody>
    </table>
  );
};

export default InfoTable;
