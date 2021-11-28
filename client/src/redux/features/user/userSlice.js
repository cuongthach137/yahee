import { useCallback } from "react";
import { socket, userSocket } from "../../../App";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../utils/axios";
import { setSession, isValidToken } from "../../../utils/jwt";
import { toast } from "react-toastify";
const initialState = {
  user: {},
  isAuthenticated: false,
  isInitialized: false,
  status: null,
  isLoading: false,
  hasError: false,
  notifications: {
    newMessages: 0,
  },
};

// ASYNC-FUNCTIONS-----------------------------------------------------------------

const userInit = createAsyncThunk(
  "user/init",
  async (_, { dispatch, getState }) => {
    try {
      const accessToken = window.localStorage.getItem("accessToken");
      if (accessToken && isValidToken(accessToken).isValid) {
        setSession(accessToken);
        const response = await axios.get("/user");

        userSocket.emit("user-init", response.data.user._id);

        setTimeout(() => {
          dispatch(LOGOUT());
          toast.error("Your session has expired. Please login again!");
          userSocket.emit("sign-out", response.data.user._id);
          const {
            chat: { activeConversation },
          } = getState();

          socket.emit("leaveAllRooms", {
            userId: response.data.user._id,
            conversationId: activeConversation?.id,
          });
        }, isValidToken(accessToken).timeLeft);

        dispatch(
          INITIALIZE({
            isAuthenticated: true,
            user: response.data.user,
          })
        );
      } else {
        dispatch(
          INITIALIZE({
            isAuthenticated: false,
            user: null,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        INITIALIZE({
          isAuthenticated: false,
          user: null,
        })
      );
    }
  }
);
const userRegister = createAsyncThunk(
  "user/register",
  async (userInfo, { dispatch }) => {
    const response = await axios.post("/user/register", userInfo);
    const { token } = response.data;
    setSession(token);
    dispatch(REGISTER(response.data));
  }
);

const userLogin = createAsyncThunk(
  "user/login",
  async (userInfo, { dispatch }) => {
    const response = await axios.post("/user/login", userInfo);
    const { token } = response.data;

    if (userInfo.keep) {
      setSession(token);
      //... cant think of a better way for now, this clears itself when the user refreshes the page
      setTimeout(() => {
        dispatch(LOGOUT());
      }, 29 * 60000);
    }
    dispatch(LOGIN(response.data));
  }
);

const userUpdate = createAsyncThunk(
  "user/update",
  async (userInfo, { dispatch }) => {
    const response = await axios.put("/user/update", userInfo);
    dispatch(UPDATE(response.data));
  }
);
const userActivityUpdate = createAsyncThunk(
  "user/update-activity",
  async (data, { dispatch }) => {
    await axios.patch("/user/update-activity", data);
    dispatch(STATUS(data));
  }
);

const userLogout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch, getState }) => {
    console.log(getState());
    await axios.patch("/user/update-activity", {
      status: "offline",
      lastActivity: Date.now(),
    });
    setSession(null);
    dispatch(LOGOUT());
  }
);

const userChangePassword = createAsyncThunk(
  "user/changepassword",
  async (userInfo, { dispatch }) => {
    const response = await axios.put("/user/update/password", userInfo);
    dispatch(LOGIN(response.data));
  }
);

// AUTH-FUNCTIONS-----------------------------------------------------------------

export const AuthFunctions = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized, isLoading } = useSelector(
    (state) => state.user
  );
  const user = useSelector((state) => (state.user.user ? state.user.user : {}));
  const initialize = useCallback(() => {
    dispatch(userInit());
  }, [dispatch]);
  const register = (userInfo) => {
    dispatch(userRegister(userInfo));
  };
  const login = (userInfo) => {
    dispatch(userLogin(userInfo));
  };
  const logout = () => {
    dispatch(userLogout());
  };
  const update = (userInfo) => {
    dispatch(userUpdate(userInfo));
  };
  const updateActivity = (status) => {
    dispatch(userActivityUpdate(status));
  };
  const changePassword = (userInfo) => {
    dispatch(userChangePassword(userInfo));
  };

  const deactivateAccount = () => {};
  const resetPassword = () => {};
  return {
    login,
    initialize,
    register,
    logout,
    isAuthenticated,
    isInitialized,
    update,
    deactivateAccount,
    resetPassword,
    changePassword,
    isLoading,
    user,
    updateActivity,
  };
};

// SLICE-----------------------------------------------------------------

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    INITIALIZE: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isInitialized = true;
      state.user = action.payload.user;
    },
    REGISTER: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    LOGIN: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    LOGOUT: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    UPDATE: (state, action) => {
      state.user = action.payload.user;
    },
    STATUS: (state, action) => {
      state.user.user.status = action.payload;
    },
  },
  extraReducers: {
    [userUpdate.pending]: (state) => {
      state.status = "PENDING";
      state.isLoading = true;
    },
    [userUpdate.fulfilled]: (state, action) => {
      state.status = "SUCCESS";
      state.isLoading = false;
      state.hasError = false;
      toast.success("User updated successfully");
    },
    [userUpdate.rejected]: (state, action) => {
      state.status = "FAILED";
      state.isLoading = false;
      state.hasError = true;
      toast.error(
        action.error.message.startsWith("E11000")
          ? "That user name has already been taken. Please choose another"
          : action.error.message
      );
    },
    [userInit.pending]: (state) => {
      state.status = "PENDING";
      state.isLoading = true;
    },
    [userInit.fulfilled]: (state) => {
      state.status = "SUCCESS";
      state.isLoading = false;
      if (state.user) {
        userSocket.emit("user-init", state.user._id);
      }
    },
    [userInit.rejected]: (state) => {
      state.status = "FAILED";
      state.isLoading = false;
      toast.error(`Something went wrong`);
    },
    [userLogin.pending]: (state) => {
      state.status = "PENDING";
      state.isLoading = true;
    },
    [userLogin.fulfilled]: (state) => {
      state.status = "SUCCESS";
      state.isLoading = false;
      userSocket.emit("sign-in", state.user._id);
      toast.success(`Welcome back, ${state.user.name} 🔥🔥`);
    },
    [userLogin.rejected]: (state, action) => {
      state.status = "FAILED";
      state.isLoading = false;
      toast.error(action?.error?.message);
    },
    [userLogout.pending]: (state) => {
      state.status = "PENDING";
      state.isLoading = true;
      userSocket.emit("sign-out", state.user._id);
      socket.emit("leaveAllRooms", state);
    },
    [userLogout.fulfilled]: (state) => {
      state.status = "SUCCESS";
      state.isLoading = false;
    },
    [userLogout.rejected]: (state) => {
      state.status = "FAILED";
      state.isLoading = false;
    },
    [userChangePassword.pending]: (state) => {
      state.status = "PENDING";
      state.isLoading = true;
    },
    [userChangePassword.fulfilled]: (state) => {
      state.status = "SUCCESS";
      state.isLoading = false;
      state.hasError = false;
      toast.success("Password updated successfully");
    },
    [userChangePassword.rejected]: (state, action) => {
      state.status = "FAILED";
      state.isLoading = false;
      state.hasError = true;
      toast.error(
        action?.error?.message.startsWith("jwt")
          ? "Session expired. Please login again!"
          : "Something went wrong. We just don't know what thing yet hehe"
      );
    },
    [userRegister.pending]: (state) => {
      state.status = "PENDING";
      state.isLoading = true;
    },
    [userRegister.fulfilled]: (state) => {
      state.status = "SUCCESS";
      state.isLoading = false;
      toast.success("Yo welcome to the club");
    },
    [userRegister.rejected]: (state, action) => {
      state.status = "FAILED";
      state.isLoading = false;
      toast.error(
        action.error.message.startsWith("E11000")
          ? `${action.error.message.slice(
              action.error.message.indexOf("{") + 1,
              action.error.message.indexOf("}")
            )} has already been taken`
          : "Something went wrong. Please try again in a few seconds!"
      );
    },
  },
});

export const {
  INITIALIZE,
  REGISTER,
  LOGIN,
  LOGOUT,
  UPDATE,
  PENDING,
  SUCCESS,
  REJECT,
  STATUS,
} = userSlice.actions;

export default userSlice.reducer;
