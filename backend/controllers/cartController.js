const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.saveCart = catchAsync(async (req, res) => {
  const { items: userItems } = req.body;

  const items = [];

  for (let userItem of userItems) {
    const product = await Product.findById(userItem.item._id);
    if (product) {
      const { price: p, size: s, discount: d, _id: id } = product;
      const selectedSize = s.find((i) => i === userItem.selectedSize);
      const asignedDiscount = d.find((i) => i === userItem.asignedDiscount);

      if (selectedSize !== undefined && asignedDiscount !== undefined) {
        items.push({
          item: id,
          buying: userItem.buying,
          itemTotalAfterDiscount:
            (p - (p * asignedDiscount) / 100) * selectedSize * userItem.buying,
          selectedSize,
          asignedDiscount,
          discountedPrice: (p - (p * asignedDiscount) / 100).toFixed(2),
          originalPrice: p,
        });
      }
    }
  }
  const quantity = items.reduce((acc, curr) => acc + curr.buying, 0);
  const cartTotal = items.reduce(
    (acc, curr) => acc + curr.itemTotalAfterDiscount,
    0
  );
  const totalWeight = items.reduce(
    (acc, curr) => acc + curr.buying * curr.selectedSize,
    0
  );

  if (req.user) {
    const { _id } = req.user;

    const user = await User.findById(_id);
    const cart = await Cart.create({
      items,
      quantity,
      cartTotal,
      cartOwner: user._id,
      totalWeight,
      isGuestCart: false,
    });

    res.status(200).json({
      status: "success",

      cart,
    });
  } else {
    const cart = await Cart.create({
      items,
      quantity,
      cartTotal,
      isGuestCart: true,
      totalWeight,
    });

    res.status(200).json({
      status: "success",
      cart,
    });
  }
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cartId = req.params.cartId;
  const cart = await Cart.findById(cartId)
    .populate({
      path: "items.item",
    })
    .populate({
      path: "coupon",
    });

  res.status(200).json({
    status: "success",
    cart,
  });
  // if (req.body.userId) {
  //   //
  //   // console.log(cart);

  // }
});
