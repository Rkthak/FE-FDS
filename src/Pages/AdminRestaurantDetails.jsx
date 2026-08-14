import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getImageUrl } from "../Services/helper";
import {
  approveRestaurant,
  deleteRestaurant,
  getRestaurantById,
} from "../Services/adminService";

const AdminRestaurantDetails = () => {
  const { restaurantID } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // ================= FETCH RESTAURANT =================

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRestaurantById(restaurantID);

        setRestaurant(response.restaurant || response);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load restaurant details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantID]);

  // ================= APPROVE =================

  const handleApprove = async () => {
    try {
      setActionLoading(true);

      const response = await approveRestaurant(restaurantID, {
        status: "approved",
      });

      setRestaurant((prev) => ({
        ...prev,
        status: "approved",
        rejectionReason: "",
      }));

      toast.success(response.message || "Restaurant approved successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to approve restaurant.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= REJECT =================

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter rejection reason.");
      return;
    }

    try {
      setActionLoading(true);

      const response = await approveRestaurant(restaurantID, {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      });

      setRestaurant((prev) => ({
        ...prev,
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      }));

      setShowRejectBox(false);
      setRejectionReason("");

      toast.success(response.message || "Restaurant rejected successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to reject restaurant.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?",
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(true);

      const response = await deleteRestaurant(restaurantID);

      toast.success(response.message || "Restaurant deleted successfully.");

      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete restaurant.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-xl font-bold text-slate-800">
            Restaurant Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error || "Unable to find this restaurant."}
          </p>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-16 sm:min-h-20 flex items-center justify-between gap-4">
            {/* LEFT */}

            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                ←
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                  Restaurant Details
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Review restaurant application
                </p>
              </div>
            </div>

            {/* STATUS */}

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                restaurant.status === "approved"
                  ? "bg-green-50 text-green-700"
                  : restaurant.status === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {restaurant.status || "pending"}
            </span>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}

          <div className="lg:col-span-2 space-y-6">
            {/* BANNER */}

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="w-full aspect-3/1 bg-slate-100">
                {restaurant.banner ? (
                  <img
                    src={getImageUrl(restaurant.banner)}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No Banner
                  </div>
                )}
              </div>
            </section>

            {/* BASIC INFORMATION */}

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  Basic Information
                </h2>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Info
                  label="Restaurant Name"
                  value={restaurant.restaurantName}
                />

                <Info label="ID" value={"#" + restaurant._id.slice(-8)} />

                <Info label="Phone Number" value={restaurant.phoneNumber} />

                <Info
                  label="Cuisine"
                  value={
                    Array.isArray(restaurant.cuisine)
                      ? restaurant.cuisine.join(", ")
                      : restaurant.cuisine
                  }
                />

                <div className="sm:col-span-2">
                  <Info label="Description" value={restaurant.description} />
                </div>
              </div>
            </section>

            {/* ADDRESS */}

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  Restaurant Address
                </h2>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Info label="Street" value={restaurant.address?.street} />

                <Info label="City" value={restaurant.address?.city} />

                <Info label="State" value={restaurant.address?.state} />

                <Info label="Pincode" value={restaurant.address?.pincode} />

                <Info label="Country" value={restaurant.address?.country} />
              </div>
            </section>

            {/* DELIVERY */}

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  Delivery Information
                </h2>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Info label="Delivery Time" value={restaurant.deliveryTime} />

                <Info
                  label="Delivery Fee"
                  value={
                    restaurant.deliveryFee !== undefined
                      ? `₹${restaurant.deliveryFee}`
                      : "-"
                  }
                />

                <Info
                  label="Minimum Order"
                  value={
                    restaurant.minimumOrder !== undefined
                      ? `₹${restaurant.minimumOrder}`
                      : "-"
                  }
                />
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="space-y-6">
            {/* LOGO */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800 mb-4">Restaurant Logo</h2>

              <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {restaurant.logo ? (
                  <img
                    src={getImageUrl(restaurant.logo)}
                    alt="Restaurant logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-4xl">🏪</span>
                )}
              </div>
            </section>

            {/* STATUS */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800">Restaurant Status</h2>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Application Status
                </span>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                    restaurant.status === "approved"
                      ? "bg-green-50 text-green-700"
                      : restaurant.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {restaurant.status || "pending"}
                </span>
              </div>
            </section>

            {/* ACTIONS */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800">Admin Actions</h2>

              <div className="mt-5 space-y-3">
                {restaurant.status !== "approved" && (
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold text-sm"
                  >
                    {actionLoading ? "Processing..." : "✓ Approve Restaurant"}
                  </button>
                )}

                {restaurant.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-semibold text-sm"
                  >
                    ✕ Reject Restaurant
                  </button>
                )}

                {showRejectBox && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
                    <label className="block text-sm font-semibold text-red-700 mb-2">
                      Rejection Reason
                    </label>

                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      placeholder="Enter reason for rejecting this restaurant..."
                      className="w-full px-4 py-3 rounded-xl border border-red-200 bg-white outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none text-sm"
                    />

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRejectBox(false);
                          setRejectionReason("");
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold text-sm"
                      >
                        {actionLoading ? "Rejecting..." : "Confirm Reject"}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-semibold text-sm"
                >
                  🗑 Delete Restaurant
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

// ================= INFO COMPONENT =================

const Info = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700 wrap-break-words">
        {value || "-"}
      </p>
    </div>
  );
};

export default AdminRestaurantDetails;
