import protectedInstance from "../Instances/protectedInstance";

export const placeOrder = async (paymentMethod) => {
  const response = await protectedInstance.post("/order", {
    paymentMethod,
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await protectedInstance.get("/order/my");
  return response.data;
};

export const getOrderById = async (orderID) => {
  const response = await protectedInstance.get(`/order/${orderID}`);
  return response.data;
};

export const cancelOrder = async (orderID) => {
  const response = await protectedInstance.patch(`/order/${orderID}/cancel`);
  return response.data;
};
