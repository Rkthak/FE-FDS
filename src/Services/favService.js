import protectedInstance from "../Instances/protectedInstance";

// Favorite Restaurant

export const updateFavoriteRestaurant = async (restaurantID) => {
  const response = await protectedInstance.patch(
    `/favorite/restaurant/${restaurantID}`,
  );

  return response.data;
};

export const getFavoriteRestaurants = async () => {
  const response = await protectedInstance.get("/favorite/restaurant");

  return response.data;
};

// Favorite Menu

export const updateFavoriteMenu = async (menuID) => {
  const response = await protectedInstance.patch(`/favorite/menu/${menuID}`);

  return response.data;
};

export const getFavoriteMenus = async () => {
  const response = await protectedInstance.get("/favorite/menu");

  return response.data;
};
