import publicInstance from "../Instances/publicInstance";
import protectedInstance from "../Instances/protectedInstance";

export const getAllRestaurant = async () => {
  const response = await publicInstance.get("/restaurant");

  return response.data;
};

export const getRestaurantBySlug = async (slugID) => {
  const response = await publicInstance.get(`/restaurant/${slugID}`);

  return response;
};

export const searchRestaurants = async (filters) => {
  const response = await publicInstance.get("/restaurant/search", {
    params: filters,
  });

  return response.data;
};

export const getRestaurantMenus = async (restaurantID) => {
  const response = await publicInstance.get(`/menu/restaurant/${restaurantID}`);

  return response;
};

export const getMyRestaurant = async () => {
  const response = await protectedInstance.get("/restaurant/my");
  return response.data;
};

export const getMyRestaurantById = async (slugID) => {
  const response = await protectedInstance.get(`/restaurant/my/${slugID}`);
  return response.data;
};

export const updateMyRestaurant = async (slugID, restaurantData) => {
  const response = await protectedInstance.put(
    `/restaurant/my/${slugID}`,
    restaurantData,
  );
  return response.data;
};

export const deleteMyRestaurant = async (slugID) => {
  const response = await protectedInstance.delete(`/restaurant/my/${slugID}`);
  return response.data;
};

export const uploadRestaurantLogo = async (slugID, file) => {
  const formData = new FormData();

  formData.append("restaurantLogo", file);

  const response = await protectedInstance.put(
    `/restaurant/my/${slugID}/upload-logo`,
    formData,
  );

  return response.data;
};

export const uploadRestaurantBanner = async (slugID, file) => {
  const formData = new FormData();

  formData.append("restaurantBanner", file);

  const response = await protectedInstance.put(
    `/restaurant/my/${slugID}/upload-banner`,
    formData,
  );

  return response.data;
};
