import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ProductDetails.styles.scss";
//externals

//local components
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import ImageGallery from "../../components/ProductDetails/ImageGallery";
import ProductDisplaySke from "../../components/Skeletons/ProductDetails";
import ProductIndepth from "../../components/ProductDetails/ProductIndepth";
//icons

//material ui components
import { getProduct } from "../../functions/productFunctions";
import { ProgressContext } from "../../contexts/ProgressContext";
import ProductInfo from "../../components/ProductDetails/ProductInfo";
import ProductInDepth from "../../components/Skeletons/ProductIndepth";
import NotFound from "../notFound/NotFound";
import SeenProducts from "../../components/SeenProducts/SeenProducts";

const ProductDetails = () => {
  const { pathname } = useLocation();
  const { productSlug } = useParams();
  const setProgress = useContext(ProgressContext)[1];
  const links = pathname.split("/");
  const [product, setProduct] = useState(null);
  const [docTit, setDocTit] = useState("");

  document.title = `C9STORE - ${docTit || "product"}`;

  useEffect(() => {
    window.scrollTo(0, 0);
    setProgress(true);
    getProduct(productSlug)
      .then((res) => {
        setProgress(false);
        setProduct(res.data.product);
        // setProduct(null);
        setDocTit(res.data.product.title);
      })
      .catch((err) => {
        console.log(err);
        setProduct(undefined);
        setProgress(false);
      });
  }, [productSlug, setProgress]);
  return (
    <div className="product__details">
      <div className="container">
        <div className="product__details__bread-crumbs">
          <BreadCrumbs links={links} />
        </div>
      </div>
      {product === undefined && (
        <div className="container">
          <NotFound>
            We can't locate <strong>{links[3]}</strong> anywhere in our website{" "}
          </NotFound>
        </div>
      )}
      {product === null && (
        <>
          <div className="container">
            <div className="skeleton">
              <ProductDisplaySke />
            </div>
          </div>
          <div className="container">
            <div className="skeleton">
              <ProductInDepth />
            </div>
          </div>
        </>
      )}
      {product && (
        <>
          <div className="container">
            <div className="product__details__body">
              <ImageGallery product={product} />
              <ProductInfo product={product} />
            </div>
          </div>
          <div className="product__details__in-depth">
            <ProductIndepth product={product} />
          </div>
        </>
      )}
      <div className="container">
        <SeenProducts />
      </div>
    </div>
  );
};

export default ProductDetails;
