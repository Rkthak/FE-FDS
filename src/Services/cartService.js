import protectedInstance from "../Instances/protectedInstance";

// Get cart
export const getCart = async () => {
  const response = await protectedInstance.get("/cart");
  return response.data;
};

// Add item
export const addToCart = async (menuID, quantity = 1) => {
  const response = await protectedInstance.post("/cart", {
    menuID,
    quantity,
  });

  return response.data;
};

// Update quantity
export const updateCartItem = async (menuID, quantity) => {
  const response = await protectedInstance.put(`/cart/item/${menuID}`, {
    quantity,
  });

  return response.data;
};

// Remove item
export const removeCartItem = async (menuID) => {
  const response = await protectedInstance.delete(`/cart/item/${menuID}`);

  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await protectedInstance.delete("/cart/clear");

  return response.data;
};
