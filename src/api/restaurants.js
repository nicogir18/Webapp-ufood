import { axiosInstance } from "./api";

const API_BASE_ROUTE = "/restaurants";

export const getRestaurants = async (limit = 130) => {
  const params = { params: { limit: limit } };
  return await axiosInstance.get(API_BASE_ROUTE, params);
};

export const getRestaurantsWithFilter = async (
  lon = null,
  lat = null,
  q = null,
  priceRange = null,
  genres = null
) => {
  const params = { params: {} };

  if (lon && lat) {
    params.params.lon = lon;
    params.params.lat = lat;
  }

  if (q) {
    params.params.q = q;
  }

  if (priceRange) {
    params.params.price_range = priceRange;
  }

  if (genres) {
    params.params.genres = genres;
  }

  return await axiosInstance.get(API_BASE_ROUTE, params);
};

export const getRestaurantsById = async (id) => {
  return await axiosInstance.get(`${API_BASE_ROUTE}/${id}`);
};
