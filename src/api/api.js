import axios from "axios";
import store from "../store";

export const axiosInstance = axios.create({
  baseURL: "https://ufoodapi.herokuapp.com/",
});

axiosInstance.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      store.dispatch("LogOut");
      return router.push("/login");
    }
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token;
    if (token) {
      config.headers.Authorization = token;
    } else {
      throw new Error("Token missing. Request cannot be launched.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
