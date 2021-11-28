import React from "react";
import ReactDOM from "react-dom";
import "./styles/main.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ProgressProvider } from "./contexts/ProgressContext";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import { ModalProvider } from "./contexts/modalContext/ModalContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const initialOptions = {
  "client-id":
    "Aeo545ZYzuXUHTqXyfiwwcys5Bb_20TyO5qiKLQSzQVveEa4Ykxb-i1wkfHfDVvymIKnOVIafTZTm1fO",
  currency: "USD",
  intent: "capture",
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <PayPalScriptProvider options={initialOptions}>
          <BrowserRouter>
            <ProgressProvider>
              <ModalProvider>
                <App />
              </ModalProvider>
            </ProgressProvider>
          </BrowserRouter>
        </PayPalScriptProvider>
      </MuiPickersUtilsProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
