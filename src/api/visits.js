import { axiosInstance } from "./api";

const createApiBaseRoute = (id, restaurantId = null) => {
  return restaurantId
    ? `/users/${id}/restaurants/${restaurantId}/visits`
    : `/users/${id}/restaurants/visits`;
};

export const getVisitsByUserId = async (id) => {
  return await axiosInstance.get(createApiBaseRoute(id));
};

export const addVisitByUserId = async (id, visit) => {
  return await axiosInstance.post(createApiBaseRoute(id), visit);
};

export const getVisitsByUserIdAndRestaurantId = async (
  userId,
  restaurantId
) => {
  return await axiosInstance.get(createApiBaseRoute(userId, restaurantId));
};
