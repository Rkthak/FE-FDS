const BASE_URL = "http://localhost:5000";

export const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${BASE_URL}/${image}`;
};
