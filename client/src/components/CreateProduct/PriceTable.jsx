import React from "react";
import "./PriceTable.styles.scss";
const PriceTable = ({ size, discount, price }) => {
  function oriTotal(item, price) {
    return (item * price).toFixed(2);
  }
  function totAfterDis(item, price, index) {
    return (
      item * price -
      (item * price * discount[index > 2 ? 2 : index] || 0) / 100
    ).toFixed(2);
  }
  function priceAfterDis(price, index) {
    return (
      price -
      (price * discount[index > 2 ? 2 : index] || 0) / 100
    ).toFixed(2);
  }
  return (
    <div className="price-table">
      <table>
        <thead>
          <tr>
            <td>
              <strong>Price estimates</strong>
            </td>
            {size &&
              size.length > 0 &&
              size.map((item, index) => <td key={item}>Size {index + 1}</td>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Size</td>
            {size &&
              size.length > 0 &&
              size.map((item) => <td key={item}>{item}g</td>)}
          </tr>
          <tr>
            <td>Discount Level</td>
            {discount &&
              discount.length > 0 &&
              Array(size.length)
                .fill(0)
                .map((item, index) => (
                  <td key={index}>
                    {index < discount.length
                      ? discount[index]
                      : discount[discount.length - 1]}
                    %
                  </td>
                ))}
          </tr>
          <tr>
            <td>Price/g</td>
            {size &&
              size.length > 0 &&
              size.map((item, index) => (
                <td key={item}>${priceAfterDis(price, index)}</td>
              ))}
          </tr>
          <tr>
            <td>Original total</td>
            {size &&
              size.length > 0 &&
              size.map((item, index) => (
                <td key={item}>${oriTotal(item, price)}</td>
              ))}
          </tr>
          <tr>
            <td>Total after discount</td>
            {size &&
              size.length > 0 &&
              size.map((item, index) => (
                <td key={item}>${totAfterDis(item, price, index)}</td>
              ))}
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  );
};

export default PriceTable;
