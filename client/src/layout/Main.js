import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { userSocket } from "../App";
import { socket } from "../App";
import ChatBox from "../components/ChatBox/ChatBox";
import Footer from "../components/Footer/Footer";
import { ProgressContext } from "../contexts/ProgressContext";
import useAuth from "../customHooks/useAuthentication";
import useChat from "../customHooks/useChat";
import { persistCartToRedux } from "../redux/features/cart/cartSlice";
import Router from "../routes/Router";
import LinearProgress from "../styles/override/LinearProgress";

const Index = () => {
  const [progress] = useContext(ProgressContext);
  const dispatch = useDispatch();
  const { updateOnlineUsers, onlineUsers } = useChat();
  const { initialize, isInitialized, user, isLoading } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(cart)) dispatch(persistCartToRedux(cart));
  }, [dispatch]);

  useEffect(() => {
    userSocket.off("online-count").on("online-count", (users) => {
      if (onlineUsers.length === users.length) return;
      updateOnlineUsers(users);
    });
  }, [updateOnlineUsers, onlineUsers?.length]);

  useEffect(() => {
    if (user._id) {
      socket.emit("enter", user._id);
    }
  }, [user._id]);
  return (
    <>
      {isInitialized && (
        <>
          {progress || isLoading ? <LinearProgress /> : ""}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            limit={2}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />
          <Router />
          <Footer />
          <ChatBox />
        </>
      )}
    </>
  );
};

export default Index;
