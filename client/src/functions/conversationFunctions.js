import axios from "../utils/axios";

export const createConversation = (members) => {
  return axios.post("/conversation", members);
};
export const getConversations = (userId) => {
  return axios.get(`/conversations/${userId}`);
};
