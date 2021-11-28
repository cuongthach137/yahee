//shop
import Home from "../pages/home/Home";
import ProductDetails from "../pages/product/ProductDetails";
import Shop from "../pages/shop/Shop";
import Checkout from "../pages/checkout/Checkout";
import Cart from "../pages/cart/Cart";

//user
import User from "../pages/account/user/User";

//registration
import SignIn from "../pages/registration/SignIn";
import Register from "../pages/registration/Register";

//admin
import Account from "../pages/account/Account";
import DashBoardApp from "../pages/account/admin/DashBoardApp";
import CreateProduct from "../pages/account/admin/products/CreateProduct";
import ListProducts from "../pages/account/admin/products/ListProducts";
import CreateCoupon from "../pages/account/admin/coupons/CreateCoupon";
import Chat from "../pages/account/admin/messages/Chat";
import Messenger from "../pages/account/user/Messenger";

export const shopRoutes = [
  {
    path: "/",
    component: Home,
  },

  {
    path: "/collections/:category",
    component: Shop,
  },

  {
    path: "/checkout",
    component: Checkout,
  },
  {
    path: "/cart",
    component: Cart,
  },
  {
    path: "/:productSlug",
    component: ProductDetails,
  },
];

//userRoutes

export const userRoutes = [
  {
    path: "/user/general",
    component: User,
  },
  {
    path: "/user/messenger",
    component: Messenger,
  },
];

//authRoutes
export const authRoutes = [
  {
    path: "/auth/login",
    component: SignIn,
  },
  {
    path: "/auth/register",
    component: Register,
  },
];

//adminRoutes
export const adminRoutes = [
  {
    path: "/admin",
    component: Account,
    subRoutes: [
      {
        path: "/admin/app",
        component: DashBoardApp,
      },
      {
        path: "/admin/product/create",
        component: CreateProduct,
      },
      {
        path: "/admin/product/edit",
        component: CreateProduct,
      },
      {
        path: "/admin/product/list",
        component: ListProducts,
      },
      {
        path: "/admin/coupon",
        component: CreateCoupon,
      },
      {
        path: "/admin/messages",
        component: Chat,
      },
    ],
  },
];
