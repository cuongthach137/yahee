import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const initialState = {
  notifications: [],
};

export const NotificationFunctions = () => {
  const dispatch = useDispatch();

  const updateNotification = (data) => dispatch(UPDATE(data));
  return { updateNotification };
};
export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    UPDATE: (state, action) => {
      state.notifications.push(action.payload);
    },
  },
});

export const { UPDATE } = notificationSlice.actions;

export default notificationSlice.reducer;
