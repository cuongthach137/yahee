import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import axios from "./axios";

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const { exp } = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;
  const timeLeft = (exp - currentTime) * 1000;
  return { isValid: exp > currentTime, timeLeft };
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession, verify, sign };
