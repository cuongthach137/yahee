import React from "react";
import ContentLoader from "react-content-loader";

const ProductInDepth = (props) => (
  <ContentLoader
    speed={2}
    width={1400}
    height={548}
    viewBox="0 0 1400 548"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="600" y="38" rx="0" ry="0" width="600" height="70" />
  </ContentLoader>
);

export default ProductInDepth;
