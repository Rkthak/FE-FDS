import protectedInstance from "../Instances/protectedInstance";
import publicInstance from "../Instances/publicInstance";

export const registerUser = async (userData) => {
  const response = await publicInstance.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await protectedInstance.post("/auth/login", credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await protectedInstance.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await protectedInstance.post("/auth/logout");
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await protectedInstance.put("/auth/profile", userData);

  return response.data;
};

export const updateProfilePicture = async (imageFile) => {
  const formData = new FormData();

  formData.append("profileImage", imageFile);

  console.log("FILE BEING SENT:", imageFile);
  console.log("FORM DATA:", formData.get("profileImage"));

  const response = await protectedInstance.put(
    "/auth/upload-profileImage",
    formData,
  );
  return response.data;
};
