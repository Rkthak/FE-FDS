import { useEffect, useState } from "react";

import {
  createReview,
  deleteMyReview,
  getMyReviews,
  getRestaurantReviews,
  updateMyReview,
} from "../Services/reviewService";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const RestaurantReviews = ({ slug }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ==================== FETCH REVIEWS ====================
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Public restaurant reviews
        const reviewsResponse = await getRestaurantReviews(slug);
        setReviews(reviewsResponse.reviews || []);

        // User's own review
        try {
          const myReviewsResponse = await getMyReviews();

          const review = myReviewsResponse.reviews?.find(
            (item) => item.restaurantId?.slug === slug,
          );

          if (review) {
            setMyReview(review);
            setRestaurantRating(review.restaurantRating);
            setDeliveryRating(review.deliveryRating);
            setComment(review.comment);
          } else {
            setMyReview(null);
            setRestaurantRating(0);
            setDeliveryRating(0);
            setComment("");
          }
        } catch {
          setMyReview(null);
        }
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // ==================== STAR RATING ====================
  const renderStars = (rating, setRating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-3xl ${
              star <= rating ? "text-orange-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // ==================== SUBMIT / UPDATE ====================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!restaurantRating) {
      toast.error("Please select restaurant rating");
      return;
    }

    if (!deliveryRating) {
      toast.error("Please select delivery rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("Review must contain at least 3 characters");
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        restaurantRating,
        deliveryRating,
        comment: comment.trim(),
      };

      if (myReview) {
        await updateMyReview(slug, reviewData);
      } else {
        await createReview(slug, reviewData);
      }

      // Refresh reviews after submit/update
      const reviewsResponse = await getRestaurantReviews(slug);
      setReviews(reviewsResponse.reviews || []);

      const myReviewsResponse = await getMyReviews();

      const updatedReview = myReviewsResponse.reviews?.find(
        (item) => item.restaurantId?.slug === slug,
      );

      if (updatedReview) {
        setMyReview(updatedReview);
        setRestaurantRating(updatedReview.restaurantRating);
        setDeliveryRating(updatedReview.deliveryRating);
        setComment(updatedReview.comment);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== DELETE ====================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteMyReview(slug);

      setMyReview(null);
      setRestaurantRating(0);
      setDeliveryRating(0);
      setComment("");

      const reviewsResponse = await getRestaurantReviews(slug);
      setReviews(reviewsResponse.reviews || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  // ==================== LOADING ====================
  if (loading) {
    return (
      <section className="mt-8">
        <p className="text-gray-500">Loading reviews...</p>
      </section>
    );
  }

  // ==================== UI ====================
  return (
    <section className="mt-8 space-y-8">
      {/* ==================== REVIEW FORM ==================== */}
      {user?.role === "user" && (
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-2xl font-bold">
            {myReview ? "Update Your Review" : "Write a Review"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Share your restaurant and delivery experience.
          </p>

          {/* Restaurant Rating */}
          <div className="mt-6">
            <p className="mb-2 font-semibold">Restaurant Rating</p>

            {renderStars(restaurantRating, setRestaurantRating)}
          </div>

          {/* Delivery Rating */}
          <div className="mt-6">
            <p className="mb-2 font-semibold">Delivery Rating</p>

            {renderStars(deliveryRating, setDeliveryRating)}
          </div>

          {/* Comment */}
          <div className="mt-6">
            <p className="mb-2 font-semibold">Your Review</p>

            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write your review..."
              rows={5}
              maxLength={1000}
              className="w-full rounded-lg border p-3 outline-none focus:border-black"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {comment.length}/1000
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || deleting}
              className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
            >
              {submitting
                ? "Please wait..."
                : myReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>

            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting || deleting}
                className="rounded-lg bg-red-500 px-5 py-2 text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Review"}
              </button>
            )}
          </div>

          {/* Rejected Review Message */}
          {myReview?.status === "rejected" && myReview?.moderationNote && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">⚠️</span>

                <div>
                  <p className="font-semibold text-red-700">
                    Your review was rejected
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-600">
                    {myReview.moderationNote}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== REVIEWS ==================== */}
      <div>
        <h2 className="text-2xl font-bold">Customer Reviews</h2>

        <p className="mt-1 text-sm text-gray-500">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>

        {reviews.length === 0 ? (
          <div className="mt-4 rounded-xl border p-6">
            <p className="text-gray-500">No reviews yet.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-xl border bg-white p-5">
                {/* User */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold capitalize">
                      {review.userId?.userName || "User"}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {review.userId?.email || "xyz_123@example.com"}
                    </p>
                  </div>

                  <span className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Ratings */}
                <div className="mt-3 space-y-1">
                  <p>
                    <span className="font-medium">Restaurant:</span>{" "}
                    <span className="text-orange-400">
                      {"★".repeat(review.restaurantRating)}
                    </span>
                    <span className="text-gray-300">
                      {"☆".repeat(5 - review.restaurantRating)}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium">Delivery:</span>{" "}
                    <span className="text-orange-400">
                      {"★".repeat(review.deliveryRating)}
                    </span>
                    <span className="text-gray-300">
                      {"☆".repeat(5 - review.deliveryRating)}
                    </span>
                  </p>
                </div>

                {/* Comment */}
                <p className="mt-4 text-gray-700">{review.comment}</p>

                {/* Restaurant Response */}
                {review.restaurantResponse && (
                  <div className="mt-4 rounded-lg bg-gray-100 p-4">
                    <p className="font-semibold">Restaurant Response</p>

                    <p className="mt-1 text-gray-600">
                      {review.restaurantResponse}
                    </p>

                    {review.respondedAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(review.respondedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantReviews;
