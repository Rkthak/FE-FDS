const BASE_URL = "http://localhost:5000";

export const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${BASE_URL}/${image}`;
};

export const formatTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");

  const hour = Number(hours);

  const period = hour >= 12 ? "PM" : "AM";

  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${period}`;
};
