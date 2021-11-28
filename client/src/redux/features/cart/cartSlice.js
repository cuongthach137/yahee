import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
  items: [],
  quantity: 0,
  cartTotal: 0,
  totalAfterDiscount: 0,
  totalWeight: 0,
  isCouponApplied: false,
  cartId: "",
  cartOwner: "",
  coupon: {},
};

export const CartFunctions = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  function saveCart(localCart) {
    localStorage.setItem("cart", JSON.stringify(localCart));
    dispatch(persistCartToRedux(localCart));
  }
  function handleQuantity(
    direction,
    item,
    selectedSize,
    buying,
    discountedPrice,
    asignedDiscount
  ) {
    const localCart = items.map((i) =>
      (i.item._id === item._id && i.selectedSize !== selectedSize) ||
      i.item._id !== item._id
        ? i
        : {
            ...i,
            item,
            buying: direction === "add" ? buying + 1 : buying - 1,
            itemTotalAfterDiscount:
              (direction === "add" ? buying + 1 : buying - 1) *
              discountedPrice *
              (selectedSize || 1),
            selectedSize,
            discountedPrice,
            asignedDiscount,
          }
    );
    saveCart(localCart);
  }
  function removeItem(item, selectedSize) {
    const localCart = [
      ...items.filter((i) => i.item._id !== item._id),
      ...items.filter(
        (i) => i.item._id === item._id && i.selectedSize !== selectedSize
      ),
    ];
    saveCart(localCart);
  }

  function addItemToCart(product, quantity, size) {
    function calDiscount() {
      return (
        product.discount[product.size.indexOf(size)] ??
        product.discount[product.size.indexOf(size) - 1] ??
        product.discount[2] ??
        product.discount[1] ??
        0
      );
    }
    function calTotal() {
      const total =
        (product.price - (product.price * calDiscount()) / 100) *
        (size || 1) *
        quantity;
      return total;
    }
    const productToCart = {
      item: { ...product },
      buying: quantity,
      selectedSize: size,
      origonalPrice: product.price,
      discountedPrice: product.price - (product.price * calDiscount()) / 100,
      itemTotalAfterDiscount: calTotal(),
      asignedDiscount: calDiscount(),
    };

    let localCart = JSON.parse(localStorage.getItem("cart"));
    if (!localCart) {
      localStorage.setItem("cart", JSON.stringify([productToCart]));
      dispatch(persistCartToRedux([productToCart]));
    } else {
      if (!Array.isArray(localCart)) {
        localStorage.setItem("cart", JSON.stringify([]));
      } else {
        const repeated = localCart.find(
          (i) =>
            i.item._id === productToCart.item._id && i.selectedSize === size
        );
        if (repeated) {
          localCart = [
            ...localCart.filter(
              (i) => i.item._id === repeated.item._id && i.selectedSize !== size
            ),
            ...localCart.filter((i) => i.item._id !== repeated.item._id),
            {
              ...repeated,
              buying: repeated.buying + quantity,
              itemTotalAfterDiscount:
                repeated.itemTotalAfterDiscount + calTotal(),
            },
          ];
          saveCart(localCart);
        } else {
          localCart = [...localCart, productToCart];
          saveCart(localCart);
        }
      }
    }
  }
  return { handleQuantity, removeItem, addItemToCart };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    persistCartToRedux: (state, action) => {
      state.items = action.payload;
      if (state.items) {
        state.cartTotal = +state.items.reduce(
          (acc, curr) => acc + curr.itemTotalAfterDiscount,
          0
        );
        state.totalAfterDiscount = state.cartTotal;
        state.quantity = state.items.reduce(
          (acc, curr) => acc + curr.buying,
          0
        );
        state.totalWeight = state.items.reduce(
          (acc, curr) => acc + curr.buying * (curr.selectedSize || 0),
          0
        );
      }
    },
    persistSavedCartToRedux: (state, action) => {
      state.items = action.payload.items;
      state.cartId = action.payload._id;
      state.cartOwner = action.payload.cartOwner || "guest";
      state.cartTotal = action.payload.cartTotal;
      state.quantity = action.payload.quantity;
      state.totalWeight = action.payload.totalWeight;
      state.totalAfterDiscount =
        action.payload.totalAfterDiscount || state.cartTotal;
      state.isCouponApplied = action.payload.isCouponApplied || false;
      state.coupon = action.payload.coupon;
    },
    removeCoupon: (state) => {
      state.coupon = {};
      state.isCouponApplied = false;
      state.totalAfterDiscount = state.cartTotal;
    },
  },
});

export const { persistCartToRedux, persistSavedCartToRedux, removeCoupon } =
  cartSlice.actions;

export default cartSlice.reducer;
