import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/favorites";

export const getFavoritesListByListId = async (id) => {
  return await axiosInstance.get(`${API_BASE_ROUTE}/${id}`);
};

export const createFavoriteList = async (newList) => {
  return await axiosInstance.post(API_BASE_ROUTE, newList);
};

export const updateFavoritesListByListId = async (id, updatedList) => {
  return await axiosInstance.put(`${API_BASE_ROUTE}/${id}`, updatedList);
};

export const removeFavoritesList = async (id) => {
  return await axiosInstance.delete(`${API_BASE_ROUTE}/${id}`);
};

export const addRestaurantsToFavoritesList = async (id, restaurantId) => {
  return await axiosInstance.post(`${API_BASE_ROUTE}/${id}/restaurants`, {
    id: restaurantId,
  });
};

export const removeRestaurantsToFavoritesList = async (id, restaurantId) => {
  return await axiosInstance.delete(
    `${API_BASE_ROUTE}/${id}/restaurants/${restaurantId}`
  );
};
