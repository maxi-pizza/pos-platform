import axios from "axios";

const maxipizzaApiClient = axios.create({
  baseURL: import.meta.env.VITE_MAXIPIZZA_API_BASE_URL,
});

export const logError = (data) => {
  return maxipizzaApiClient.post("/log-error", data);
};
