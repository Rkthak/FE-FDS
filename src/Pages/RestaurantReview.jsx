import { useEffect, useState } from "react";
import {
  getMyRestaurantReviews,
  respondToReview,
} from "../Services/reviewService";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const RestaurantReview = () => {
  const { slugID } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    if (!slugID) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const response = await getMyRestaurantReviews(slugID);

        setReviews(response.reviews || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [slugID]);

  const handleResponseChange = (reviewId, value) => {
    setResponseText((previous) => ({
      ...previous,
      [reviewId]: value,
    }));
  };

  const handleSubmitResponse = async (reviewId) => {
    const text = responseText[reviewId]?.trim();

    if (!text) {
      toast.error("Please write a message");
      return;
    }

    if (text.length < 3) {
      toast.error("Message must contain at least 3 characters");
      return;
    }

    try {
      setSubmittingId(reviewId);

      const response = await respondToReview(reviewId, text);

      setReviews((previous) =>
        previous.map((review) =>
          review._id === reviewId ? response.review : review,
        ),
      );

      setResponseText((previous) => ({
        ...previous,
        [reviewId]: "",
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to respond to review",
      );
    } finally {
      setSubmittingId(null);
    }
  };

  const renderStars = (rating) => {
    return (
      <span className="text-yellow-400">
        {"★".repeat(rating)}
        <span className="text-gray-300">{"☆".repeat(5 - rating)}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0"
                  onClick={() => navigate("/restaurant/dashboard")}
                >
                  ←
                </button>

                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                    Customer Reviews
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-500 truncate">
                    View customer feedback and add response to their reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">No customer reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-xl border bg-white p-6">
              {/* Customer */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold capitalize">
                    {review.userId?.userName || "User"}
                  </h2>
                  <p className="text-xs text-text-muted">
                    {review.userId?.email || ""}
                  </p>
                </div>

                <span className="text-sm text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Ratings */}
              <div className="mt-4 space-y-2">
                <div>
                  <span className="mr-2 text-sm font-medium">Restaurant:</span>

                  {renderStars(review.restaurantRating)}
                </div>

                <div>
                  <span className="mr-2 text-sm font-medium">Delivery:</span>

                  {renderStars(review.deliveryRating)}
                </div>
              </div>

              {/* Customer Comment */}
              <div className="mt-4">
                <p className="leading-6 text-gray-700">{review.comment}</p>
              </div>

              {/* Review Rejection Message */}
              {review.status === "rejected" && review.moderationNote && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="font-semibold text-red-700">Review Rejected</p>

                  <p className="mt-1 text-sm leading-6 text-red-600">
                    {review.moderationNote}
                  </p>
                </div>
              )}

              {/* Restaurant Response */}
              <div className="mt-5 border-t pt-5">
                <p className="mb-2 font-semibold">Your Response</p>

                {review.restaurantResponse ? (
                  <>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-gray-700">
                        {review.restaurantResponse}
                      </p>

                      {review.respondedAt && (
                        <p className="mt-2 text-xs text-gray-400">
                          Responded on{" "}
                          {new Date(review.respondedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <textarea
                      value={responseText[review._id] ?? ""}
                      onChange={(event) =>
                        handleResponseChange(review._id, event.target.value)
                      }
                      placeholder="Update your response..."
                      rows={3}
                      maxLength={1000}
                      className="mt-3 w-full rounded-lg border p-3 outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={() => handleSubmitResponse(review._id)}
                      disabled={submittingId === review._id}
                      className="mt-2 rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
                    >
                      {submittingId === review._id
                        ? "Updating..."
                        : "Update Response"}
                    </button>
                  </>
                ) : (
                  <>
                    <textarea
                      value={responseText[review._id] ?? ""}
                      onChange={(event) =>
                        handleResponseChange(review._id, event.target.value)
                      }
                      placeholder="Write a response to the customer..."
                      rows={3}
                      maxLength={1000}
                      className="w-full rounded-lg border p-3 outline-none focus:border-black"
                    />

                    <button
                      type="button"
                      onClick={() => handleSubmitResponse(review._id)}
                      disabled={submittingId === review._id}
                      className="mt-2 rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
                    >
                      {submittingId === review._id ? "Sending..." : "Respond"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantReview;
