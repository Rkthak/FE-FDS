import protectedInstance from "../Instances/protectedInstance";
import publicInstance from "../Instances/publicInstance";

// ==================== USER ====================

// Create review
export const createReview = async (slug, reviewData) => {
  const response = await protectedInstance.post(`/reviews/${slug}`, reviewData);

  return response.data;
};

// Get my reviews
export const getMyReviews = async () => {
  const response = await protectedInstance.get("/reviews/my");

  return response.data;
};

// Update my review
export const updateMyReview = async (slug, reviewData) => {
  const response = await protectedInstance.patch(
    `/reviews/my/${slug}`,
    reviewData,
  );

  return response.data;
};

// Delete my review
export const deleteMyReview = async (slug) => {
  const response = await protectedInstance.delete(`/reviews/my/${slug}`);

  return response.data;
};

// ==================== PUBLIC ====================

// Get restaurant reviews
export const getRestaurantReviews = async (slug) => {
  const response = await publicInstance.get(`/reviews/restaurant/${slug}`);

  return response.data;
};

// ==================== ADMIN ====================

// Get all reviews
export const getAllReviews = async () => {
  const response = await protectedInstance.get("/reviews/admin");

  return response.data;
};

// Approve / reject review
export const moderateReview = async (reviewId, status, moderationNote) => {
  const response = await protectedInstance.patch(
    `/reviews/admin/${reviewId}/moderate`,
    {
      status,
      moderationNote,
    },
  );

  return response.data;
};

// ==================== RESTAURANT ====================

// get All Reviews
export const getMyRestaurantReviews = async (slugID) => {
  const response = await protectedInstance.get(
    `/restaurant/my/${slugID}/reviews`,
  );

  return response.data;
};

// Respond to review
export const respondToReview = async (reviewId, restaurantResponse) => {
  const response = await protectedInstance.patch(
    `/reviews/restaurant/${reviewId}/respond`,
    {
      restaurantResponse,
    },
  );

  return response.data;
};
