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

export const getMyPayments = async () => {
  const response = await protectedInstance.get("/payment/my");

  return response.data;
};
