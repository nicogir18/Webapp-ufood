import { axiosInstance } from "./api";

export const login = async (user) => {
  return await axiosInstance.post("/login", new URLSearchParams(user), {
    headers: { "content-type": "application/x-www-form-urlencoded" },
  });
};

export const signup = async (newUser) => {
  return await axiosInstance.post("/signup", newUser);
};
