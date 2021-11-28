import React, { useContext, useEffect, useState } from "react";
import "./ListProducts.styles.scss";
import {
  deleteProduct,
  listAllProducts,
} from "../../../../functions/productFunctions";
import Rating from "@material-ui/lab/Rating";
import {
  ConfirmContext,
  EditingContext,
  MessageContext,
  ModalContext,
  ProductContext,
} from "../../../../contexts/modalContext/ModalContext";
import Pagination from "@material-ui/lab/Pagination";

const ListProducts = () => {
  const handleModalState = useContext(ModalContext);
  const [isEditing, setIsEditing] = useContext(EditingContext);
  const handleMessage = useContext(MessageContext);
  const [confirm, setConfirm] = useContext(ConfirmContext);
  const [product, setProduct] = useContext(ProductContext);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isEditing) {
      listAllProducts(page).then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.totalProducts);
      });
    }
  }, [isEditing, page]);

  useEffect(() => {
    if (confirm && product) {
      deleteProduct(product._id).then(() =>
        listAllProducts().then((res) => {
          setProducts(res.data.products);
          setConfirm(false);
        })
      );
    }
  }, [confirm, product, setConfirm]);
  return (
    <div className="productList">
      <div className="search"></div>
      <div className="productList__data">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>Category</th>
              <th>Subcateogry</th>
              <th>Potency</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Sold</th>
              <th>Average Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.length > 0 &&
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.images[0]?.url} alt="" />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category?.name}</td>
                  <td>{p.subCategory?.name}</td>
                  <td>{p.details?.potency}</td>
                  <td>${p?.price}</td>
                  <td>{p?.quantity}</td>
                  <td>{p.sold}</td>
                  <td>
                    <Rating
                      name="half-rating-read"
                      defaultValue={p?.avgRating}
                      precision={0.5}
                      readOnly
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        handleModalState("openEdit");
                        setIsEditing(true);
                        setProduct(p);
                      }}
                      className="btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleModalState("openDialog");
                        handleMessage("deleteProduct");
                        setProduct(p);
                      }}
                      className="btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <Pagination
              count={Math.ceil(totalPages / 10)}
              variant="outlined"
              shape="rounded"
              onChange={(event, page) => setPage(page)}
            />
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ListProducts;
