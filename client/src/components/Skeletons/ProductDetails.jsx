import React from "react";
import ContentLoader from "react-content-loader";

const ProductBodySke = (props) => (
  <ContentLoader
    speed={2}
    width={1400}
    height={548}
    viewBox="0 0 1400 548"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="200" y="78" rx="0" ry="0" width="600" height="500" />
    <rect x="850" y="78" rx="0" ry="0" width="150" height="20" />
    <rect x="850" y="160" rx="0" ry="0" width="150" height="20" />
    <rect x="850" y="240" rx="0" ry="0" width="150" height="20" />
    <rect x="850" y="320" rx="0" ry="0" width="150" height="20" />
    <rect x="850" y="400" rx="0" ry="0" width="400" height="100" />
    <rect x="850" y="540" rx="0" ry="0" width="150" height="20" />
  </ContentLoader>
);

export default ProductBodySke;
