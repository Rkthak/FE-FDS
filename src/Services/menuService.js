import protectedInstance from "../Instances/protectedInstance";
import publicInstance from "../Instances/publicInstance";

export const getAllMenus = async () => {
  const response = await publicInstance("/menu");
  return response.data;
};

export const getMenuByID = async (menuID) => {
  const response = await publicInstance(`/menu/${menuID}`);
  return response.data;
};

// ================= RESTAURANT MENU =================

export const createMenu = async (formData) => {
  const response = await protectedInstance.post("/menu/my", formData);

  return response.data;
};

export const getMyMenu = async () => {
  const response = await protectedInstance.get("/menu/my");

  return response.data;
};

export const getMyMenuById = async (menuID) => {
  const response = await protectedInstance.get(`/menu/my/${menuID}`);

  return response.data;
};

export const updateMenu = async (menuID, formData) => {
  const response = await protectedInstance.put(`/menu/my/${menuID}`, formData);

  return response.data;
};

export const deleteMenu = async (menuID) => {
  const response = await protectedInstance.delete(`/menu/my/${menuID}`);

  return response.data;
};
