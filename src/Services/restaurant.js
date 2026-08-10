import publicInstance from "../Instances/publicInstance";

export const getAllRestaurant = async () => {
  const response = await publicInstance.get("/restaurant");

  return response.data;
};

export const getRestaurantBySlug = async (slugID) => {
  const response = await publicInstance.get(`/restaurant/${slugID}`);

  return response;
};

export const getRestaurantMenus = async (restaurantID) => {
  const response = await publicInstance.get(`/menu/restaurant/${restaurantID}`);

  return response;
};
