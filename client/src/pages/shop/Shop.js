import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import "./Shop.styles.scss";

//components
import Button from "../../components/Button/Button";
import ProductCard from "../../components/ProductCard/ProductCard";
import BreadCrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import capitalize from "../../functions/capitalize";

//material ui
import Pagination from "@material-ui/lab/Pagination";
import { queryProducts } from "../../functions/productFunctions";
import { ProgressContext } from "../../contexts/ProgressContext";
import { getCategories } from "../../functions/categoryFunctions";
import { getSubCategoriesByParent } from "../../functions/subCategoryFunctions";
import { toast } from "react-toastify";

const Shop = () => {
  const { pathname } = useLocation();
  const { category } = useParams();
  const links = pathname.split("/");
  const setProgress = useContext(ProgressContext)[1];

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcateogries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubcateogry, setSelectedSubcateogry] = useState();
  const [queryObject, setQueryObject] = useState({ category });
  const [totalPage, setTotalPage] = useState(0);
  const history = useHistory();

  useEffect(() => {
    document.title = `SHOP - ${links[
      links.length - 1
    ].toUpperCase()} | CJSTORE`;
  }, [links]);

  // GET CATEGORIES
  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories));
  }, [setCategories]);

  // GET SUB-CATEGORY BASED ON CATEGORY
  useEffect(() => {
    if (selectedCategory) {
      getSubCategoriesByParent(selectedCategory._id).then((res) =>
        setSubcateogries(res.data.subCategories)
      );
    }
  }, [selectedCategory]);
  // GET PRODUCTS BASED ON QUERYSTRING
  const getProducts = useCallback(
    (queryObj) => {
      setProgress(true);
      let queryString = [];
      const obj = queryObj;
      for (let key in obj) {
        queryString.push(`${key}=${obj[key]}`);
      }
      queryProducts(queryString.join("&"))
        .then((res) => {
          setProducts(res.data.products);
          setProgress(false);
          setTotalPage(res.data.totalProducts);
        })
        .catch((err) => {
          setProgress(false);
          console.log(err);
          toast.error(err.message);
        });
    },
    [setProgress]
  );

  useEffect(() => {
    getProducts(queryObject);
  }, [
    setProducts,
    setProgress,
    selectedCategory,
    selectedSubcateogry,
    queryObject,
    setTotalPage,
    getProducts,
  ]);
  return (
    <>
      <div className="page__header">
        <div className="container">
          <div className="bread__crumb">
            <div className="bread__crumb-link">
              <BreadCrumbs links={links} />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="shop__page">
          <div className="shop__page__side__widgets">
            <div className="shop__page__side__widgets-categories">
              <h3 className="shop__page__side__widgets-categories-header">
                Categories
              </h3>
              <div className="shop__page__side__widgets-categories-contents">
                {categories &&
                  categories.length > 0 &&
                  categories.map((cate, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (selectedCategory?._id !== cate._id) {
                          history.push(`/collections/${cate.slug}`);
                          setSelectedCategory(cate);
                          setQueryObject({
                            category: cate.slug,
                          });
                        }
                      }}
                      className="tag-btn btn ripple"
                    >
                      {capitalize(cate.name)}
                    </button>
                  ))}
              </div>
            </div>
            <div className="shop__page__side__widgets-categories">
              <h3 className="shop__page__side__widgets-categories-header">
                Sub-categories
              </h3>
              <div className="shop__page__side__widgets-categories-contents">
                {subcategories &&
                  subcategories.length > 0 &&
                  subcategories.map((cate, index) => (
                    <button
                      onClick={() => {
                        if (selectedSubcateogry?._id !== cate._id) {
                          history.push(`/collections/${cate.slug}`);
                          setSelectedSubcateogry(cate);
                          setQueryObject({
                            category: cate.slug,
                          });
                        }
                      }}
                      key={index}
                      className="tag-btn btn ripple"
                    >
                      {capitalize(cate.name)}
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div className="shop__page__products__display">
            <div className="shop__page__products__display-header">
              <div className="shop__page__products__display-header-result-count">
                {totalPage} results
              </div>

              <div className="shop__page__products__display-header-sort">
                {/* <h4>Sort</h4>
                <select>
                  <option value="bestSellers">Best Sellers</option>
                  <option value="bestSellers">Highest Rated</option>
                  <option value="bestSellers">Price: Low to High</option>
                  <option value="bestSellers">Price: High to Low</option>
                </select> */}
              </div>
            </div>
            <div className="shop__page__products__display-contents">
              <div className="shop__page__products__display-contents-product-cards">
                {products && products.length > 0
                  ? products.map((p) => (
                      <div key={p._id}>
                        <ProductCard product={p} className="product__card" />
                      </div>
                    ))
                  : "No products found"}
              </div>
              {products && products.length > 0 && (
                <div className="shop__page__products__display-contents-pagination">
                  <Pagination
                    count={Math.ceil(totalPage / 10)}
                    defaultPage={1}
                    boundaryCount={2}
                    onChange={(event, page) => {
                      getProducts({ ...queryObject, page });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
