import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const bookBaseUrl = axios.create({
  baseURL: `${API}/book`,
});

export const userBaseUrl = axios.create({
  baseURL: `${API}/user`,
});

bookBaseUrl.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("userAuth");
    const token = JSON.parse(authToken)?.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log("auth-req-error", error);
    return Promise.reject(error);
  },
);

bookBaseUrl.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("userAuth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

console.log(import.meta.env.VITE_API_URL);
