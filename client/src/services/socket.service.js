// import { io } from "socket.io-client";
import { socket, userSocket } from "../App";
import { createProduct } from "../functions/productFunctions";
// let socket;

const initiateSocketConnection = () => {
  userSocket.on("userDisconnected", (data) => {
    createProduct();
    userSocket.emit("userOptedOut", data);
  });
};
export default initiateSocketConnection;
