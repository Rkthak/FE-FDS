import publicInstance from "../Instances/publicInstance";

export const getAllMenus = async () => {
  const response = await publicInstance("/menu");
  return response.data;
};

export const getMenuByID = async (menuID) => {
  const response = await publicInstance(`/menu/${menuID}`);
  return response.data;
};
