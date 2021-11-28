import axios from "axios";

export const uploadImage = (uri) => {
  return axios.post(`${process.env.REACT_APP_API}/uploadimages`, {
    image: uri,
  });
};
export const removeImage = (imgId) => {
  return axios.post(`${process.env.REACT_APP_API}/removeimages`, {
    public_id: imgId,
  });
};
