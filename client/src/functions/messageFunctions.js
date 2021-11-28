import axios from "../utils/axios";

export const getMessages = (conversationId) =>
  axios.get(`/messages/${conversationId}`);

export const getPhotos = (conversationId) =>
  axios.get(`/messages/photos/${conversationId}`);

export const saveMessage = (message) => axios.post("/message", message);
