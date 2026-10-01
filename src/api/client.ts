import axios, { AxiosResponse, type AxiosInstance } from "axios";
import { getToken } from "./secureStore";

const API_BASE_URL = "https://api.fake-rest.refine.dev";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const item = await getToken();
    if (item) {
      config.headers.Authorization = `Bearer ${item}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (responce: AxiosResponse) => responce,
  (error) => {
    console.log("API error:", error?.responce?.data || error?.message);
    return Promise.reject(error);
  },
);

export default apiClient;
