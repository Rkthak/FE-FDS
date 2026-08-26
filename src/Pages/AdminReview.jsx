import { useEffect, useState } from "react";
import { getAllReviews, moderateReview } from "../Services/adminService";
import { useNavigate } from "react-router";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllReviews();

        setReviews(response.reviews || []);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // ================= APPROVE REVIEW =================
  const handleApprove = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this review?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(reviewId);
      setError("");

      const response = await moderateReview(reviewId, {
        status: "approved",
        moderationNote: null,
      });

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...response.review,
                userId: review.userId,
                restaurantId: review.restaurantId,
              }
            : review,
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to approve review.");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= REJECT REVIEW =================
  const handleReject = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this review?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(reviewId);
      setError("");

      const response = await moderateReview(reviewId, {
        status: "rejected",
        moderationNote:
          "This review has been removed because it does not meet our community guidelines. Reviews must contain respectful, relevant, and appropriate feedback related to the restaurant or delivery experience. Please avoid abusive, offensive, misleading, or unrelated content.",
      });

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...response.review,
                userId: review.userId,
                restaurantId: review.restaurantId,
              }
            : review,
        ),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reject review.");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= STATS =================
  const totalReviews = reviews.length;

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending",
  ).length;

  const approvedReviews = reviews.filter(
    (review) => review.status === "approved",
  ).length;

  const rejectedReviews = reviews.filter(
    (review) => review.status === "rejected",
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.restaurantRating || 0),
            0,
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="h-full px-4 sm:px-6 lg:px-10 flex items-center">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 shrink-0"
            >
              ←
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Reviews
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Monitor and manage customer feedback
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {/* TOTAL REVIEWS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Reviews</p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {totalReviews}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                💬
              </div>
            </div>
          </div>

          {/* PENDING */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {pendingReviews}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
          </div>

          {/* APPROVED */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Approved</p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {approvedReviews}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>

          {/* REJECTED */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Rejected</p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {rejectedReviews}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                ❌
              </div>
            </div>
          </div>

          {/* AVERAGE RATING */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Average Rating</p>

                <h3 className="text-3xl font-bold text-slate-800 mt-2">
                  {averageRating}

                  <span className="text-base text-slate-400 ml-1">/ 5</span>
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* ================= REVIEWS SECTION ================= */}
        <section className="mt-8">
          {/* SECTION HEADER */}
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Customer Feedback
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Review customer experiences and manage inappropriate content
            </p>
          </div>

          {/* ================= EMPTY ================= */}
          {reviews.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
              <div className="text-5xl">⭐</div>

              <h3 className="mt-4 font-semibold text-slate-700">
                No reviews yet
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Customer reviews will appear here.
              </p>
            </div>
          ) : (
            /* ================= REVIEW CARDS ================= */
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition"
                >
                  {/* ================= USER ================= */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center text-lg font-bold text-orange-600">
                        {review.userId?.userName?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {review.userId?.userName || "Unknown User"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {review.userId?.email || ""}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        review.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : review.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>

                  {/* ================= RESTAURANT ================= */}
                  <div className="mt-5 bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      Restaurant
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      {review.restaurantId?.restaurantName ||
                        "Unknown Restaurant"}
                    </p>
                  </div>

                  {/* ================= RATINGS ================= */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {/* RESTAURANT RATING */}
                    <div className="border border-slate-100 rounded-xl p-3">
                      <p className="text-xs text-slate-400">
                        Restaurant Rating
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {"⭐".repeat(Number(review.restaurantRating || 0))}

                        <span className="ml-2 text-slate-500">
                          {review.restaurantRating}/5
                        </span>
                      </p>
                    </div>

                    {/* DELIVERY RATING */}
                    <div className="border border-slate-100 rounded-xl p-3">
                      <p className="text-xs text-slate-400">Delivery Rating</p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {"⭐".repeat(Number(review.deliveryRating || 0))}

                        <span className="ml-2 text-slate-500">
                          {review.deliveryRating}/5
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ================= COMMENT ================= */}
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 uppercase font-semibold">
                      Customer Comment
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* ================= MODERATION NOTE ================= */}
                  {review.status === "rejected" && review.moderationNote && (
                    <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-red-600">
                        Moderation Note
                      </p>

                      <p className="text-sm text-red-700 mt-1">
                        {review.moderationNote}
                      </p>
                    </div>
                  )}

                  {/* ================= ACTION ================= */}
                  {review.status === "pending" && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end gap-3">
                      {/* APPROVE */}
                      <button
                        type="button"
                        onClick={() => handleApprove(review._id)}
                        disabled={actionLoading === review._id}
                        className="px-4 py-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 text-sm font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === review._id
                          ? "Processing..."
                          : "Approve Review"}
                      </button>

                      {/* REJECT */}
                      <button
                        type="button"
                        onClick={() => handleReject(review._id)}
                        disabled={actionLoading === review._id}
                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === review._id
                          ? "Processing..."
                          : "Reject Review"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminReviews;
