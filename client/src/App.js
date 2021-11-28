import { io } from "socket.io-client";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import Main from "./layout/Main";

//socket connections --- MOVE THIS TO SERVICE FO
export const socket = io(process.env.REACT_APP_SOCKET_ENDPOINT);
export const userSocket = io(`${process.env.REACT_APP_SOCKET_ENDPOINT}/user`);

function App() {
  return <Main />;
}

export default App;
