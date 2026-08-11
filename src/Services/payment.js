import protectedInstance from "../Instances/protectedInstance";

export const createPayment = async (orderID) => {
  const response = await protectedInstance.post("/payment/create", {
    orderID,
  });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await protectedInstance.post("/payment/verify", paymentData);
  return response.data;
};
