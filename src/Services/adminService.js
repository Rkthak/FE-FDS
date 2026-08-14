import protectedInstance from "../Instances/protectedInstance";

export const getRestaurants = async () => {
  const response = await protectedInstance.get("/admin/restaurant");
  return response.data;
};

export const getRestaurantById = async (restaurantID) => {
  const response = await protectedInstance.get(
    `/admin/restaurant/${restaurantID}`,
  );
  return response.data;
};

export const approveRestaurant = async (restaurantID, data) => {
  const response = await protectedInstance.patch(
    `/admin/restaurant/${restaurantID}/status`,
    data,
  );
  return response.data;
};

export const updateRestaurant = async (restaurantID, data) => {
  const response = await protectedInstance.put(
    `/admin/restaurant/${restaurantID}`,
    data,
  );
  return response.data;
};

export const deleteRestaurant = async (restaurantID) => {
  const response = await protectedInstance.delete(
    `/admin/restaurant/${restaurantID}`,
  );
  return response.data;
};
