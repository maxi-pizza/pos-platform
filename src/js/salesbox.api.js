import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const COMPANY_ID = import.meta.env.VITE_SALESBOX_COMPANY_ID;
const OWNER_PHONE = import.meta.env.VITE_SALESBOX_OWNER_PHONE;
const BASE_URL = import.meta.env.VITE_SALESBOX_API_BASE_URL;

const AUTH_TOKEN_STORAGE_KEY = "authToken";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

createAuthRefreshInterceptor(
  apiClient,
  () => {
    return authenticate();
  },
  {
    statusCodes: [401],
  },
);

export const authenticate = async () => {
  const payload = {
    phone: OWNER_PHONE,
  };

  const response = await apiClient.post(`/${COMPANY_ID}/auth`, payload);
  const data = response.data.data;
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
  return data;
};

export const getOrder = async (id) => {
  return (await apiClient.get(`/${COMPANY_ID}/orders/${id}?lang=uk`)).data;
};
