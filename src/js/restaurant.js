import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BONUSES_SECRET = import.meta.env.VITE_BONUSES_SECRET;


export const getOrder = async (id) => {
  const response = await axios.get(
    `${API_BASE_URL}/api/bonuses?secret=${BONUSES_SECRET}&order_id=${id}`
  );
  return response.data;
};

export const logError = (data) => {
  return axios.post( `${API_BASE_URL}/api/log`, data);

};

