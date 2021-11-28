import Rating from "@material-ui/lab/Rating";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAuthentication from "../../customHooks/useAuthentication";
import AddReview from "../Review/AddReview";

function RatingBox({ rating, userId }) {
  return (
    <div
      key={rating._id}
      className="product__details__in-depth__about__reviews__review"
    >
      <div className="product__details__in-depth__about__reviews__review__reviewer">
        <img
          src={rating.postedBy?.photo.url}
          alt="user profile pic"
          className="product__details__in-depth__about__reviews__review__reviewer__avatar"
        />
      </div>
      <div
        className={`product__details__in-depth__about__reviews__review__content ${
          rating.postedBy?._id === userId ? "userRating" : null
        }`}
      >
        <p className="product__details__in-depth__about__reviews__review__content__date">
          <b>
            {rating.isEdited
              ? `Posted on ${new Date(rating.createdAt).toLocaleDateString(
                  "vi-VI"
                )}  - Last modified ${new Date(
                  rating.lastEdited
                ).toLocaleDateString("vi-VI")}`
              : `Posted on ${new Date(rating.createdAt).toLocaleDateString(
                  "vi-VI"
                )}`}
          </b>{" "}
          - By{" "}
          <b>
            {rating.postedBy?._id === userId
              ? "you"
              : rating.postedBy
              ? rating.postedBy.name
              : "some random guy"}
          </b>
        </p>
        <div className="product__details__in-depth__about__reviews__review__content__rating">
          <Rating name="read-only" value={rating.star} readOnly />
        </div>
        <div className="product__details__in-depth__about__reviews__review__content__comment-box">
          {!rating.postedBy ? (
            <>
              <strike>{rating.comment}</strike>{" "}
              <strong>*This user has deleted his account</strong>
            </>
          ) : (
            <p>{rating.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const ProductReviews = ({ product }) => {
  const { isAuthenticated } = useAuthentication();
  const { _id: userId } = useSelector((state) =>
    state.user.user ? state.user.user : {}
  );

  //if a user has publised a review here and he deletes his profile this will throw an error
  const userRating = product.ratings.find(
    (rating) => rating.postedBy?._id === userId
  );
  const history = useHistory();
  const [isEditable, setIsEditable] = useState(false);

  function calAvgRating(product) {
    return (
      product.ratings.reduce((acc, curr) => acc + curr.star, 0) /
      product.ratings.length
    );
  }

  return (
    <div className="product__details__in-depth__about__reviews">
      <div className="stack">
        <h4>
          {product.ratings === undefined || product.ratings.length === 0
            ? `No review for ${product.title} yet`
            : product.ratings.length === 1
            ? `One review for ${product.title}`
            : `${product.ratings.length} reviews for ${product.title}`}{" "}
        </h4>
        {calAvgRating(product) ? (
          <p>Average Rating: {calAvgRating(product)}</p>
        ) : (
          ""
        )}
      </div>
      {product.ratings &&
        product.ratings.length > 0 &&
        product.ratings.map((rating) => (
          <RatingBox key={rating._id} userId={userId} rating={rating} />
        ))}
      <div className="product__details__in-depth__about__reviews__add-review">
        {isAuthenticated && !userRating ? (
          <AddReview mode="add" slug={product.slug} />
        ) : isAuthenticated && userRating ? (
          <p>
            You already published a review for this kush.{" "}
            {Date.now() - new Date(userRating.editableWithin) < 0 ? (
              <span style={{ display: "inline-block" }}>
                <span onClick={() => setIsEditable(!isEditable)}>
                  {" "}
                  Click here
                </span>{" "}
                {isEditable
                  ? "again if you don't want to edit your review"
                  : "to edit your review. Note: Reviews are only editable within 3 days after first published"}
              </span>
            ) : (
              "Since it's been (over) 3 days, you can no longer edit it"
            )}
          </p>
        ) : (
          <p>
            You must be a{" "}
            <span
              onClick={() =>
                history.push({
                  pathname: "/auth/login",
                  state: { from: `/${product.slug}` },
                })
              }
              className="notMember"
            >
              {" "}
              member
            </span>{" "}
            and{" "}
            <span className="notMember" onClick={() => window.scrollTo(0, 0)}>
              have purchased
            </span>{" "}
            this kush to be able to leave a review
          </p>
        )}
        {isEditable && (
          <AnimatePresence>
            <motion.div
              key="addReview"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
            >
              <AddReview userRating={userRating.comment} slug={product.slug} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
