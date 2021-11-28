import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../redux/features/cart/cartSlice";
import userReducer from "../redux/features/user/userSlice";
import chatReducer from "../redux/features/chat/chatSlice";
import notificationReducer from "../redux/features/notification/notificationSlice";

export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    chat: chatReducer,
    notifications: notificationReducer,
  },
});
