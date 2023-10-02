import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/users";

export const getUsers = async (limit = 130, q = null) => {
  const params = { params: { limit: limit } };

  if (q) {
    params.params.q = q;
  }

  return await axiosInstance.get(API_BASE_ROUTE, params);
};

export const getUsersById = async (id) => {
  return await axiosInstance.get(`${API_BASE_ROUTE}/${id}`);
};

export const getUsersFavoritesList = async (id) => {
  return await axiosInstance.get(`${API_BASE_ROUTE}/${id}/favorites`);
};

export const followUser = async (id) => {
  return await axiosInstance.post("/follow", { id: id });
};

export const unfollowUser = async (id) => {
  return await axiosInstance.delete(`/follow/${id}`);
};
