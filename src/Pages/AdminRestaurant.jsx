import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getRestaurants } from "../Services/adminService";
import { getImageUrl } from "../Services/helper";

const AdminRestaurants = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ================= FETCH RESTAURANTS =================

  const fetchRestaurants = async () => {
    try {
      setLoading(true);

      const response = await getRestaurants();

      setRestaurants(response.restaurants || response || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Unable to load restaurants.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // ================= FILTER =================

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      restaurant.restaurantName?.toLowerCase().includes(searchText) ||
      restaurant.email?.toLowerCase().includes(searchText) ||
      restaurant.phoneNumber?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || restaurant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ================= COUNTS =================

  const pendingCount = restaurants.filter(
    (restaurant) => restaurant.status === "pending",
  ).length;

  const approvedCount = restaurants.filter(
    (restaurant) => restaurant.status === "approved",
  ).length;

  const rejectedCount = restaurants.filter(
    (restaurant) => restaurant.status === "rejected",
  ).length;

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading restaurants...</p>
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
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 shrink-0"
              >
                ←
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                  All Restaurants
                </h1>

                <p className="text-xs sm:text-sm text-slate-500">
                  View and manage restaurant applications
                </p>
              </div>
            </div>

            {/* REFRESH */}

            <button
              onClick={fetchRestaurants}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-600"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ================= STATS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total" value={restaurants.length} icon="🏪" />

          <StatCard title="Pending" value={pendingCount} icon="⏳" />

          <StatCard title="Approved" value={approvedCount} icon="✓" />

          <StatCard title="Rejected" value={rejectedCount} icon="✕" />
        </div>

        {/* ================= FILTERS ================= */}

        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SEARCH */}

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Search Restaurant
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email or phone..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-sm"
                />
              </div>
            </div>

            {/* STATUS */}

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 text-sm bg-white"
              >
                <option value="all">All Restaurants</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </section>

        {/* ================= RESULTS HEADER ================= */}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Restaurants</h2>

          <p className="text-sm text-slate-500">
            {filteredRestaurants.length} result
            {filteredRestaurants.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ================= RESTAURANTS ================= */}

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🏪</div>

            <h3 className="text-lg font-bold text-slate-800">
              No restaurants found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant._id}
                restaurant={restaurant}
                onView={() =>
                  navigate(`/admin/dashboard/restaurant/${restaurant._id}`)
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ================= STAT CARD =================

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <span className="text-xl">{icon}</span>
      </div>

      <p className="text-2xl font-bold text-slate-800 mt-2">{value}</p>
    </div>
  );
};

// ================= RESTAURANT CARD =================

const RestaurantCard = ({ restaurant, onView }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
        {/* LOGO */}

        <div className="shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            {restaurant.logo ? (
              <img
                src={getImageUrl(restaurant.logo)}
                alt={restaurant.restaurantName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
        </div>

        {/* RESTAURANT INFO */}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">
              {restaurant.restaurantName}
            </h3>

            <StatusBadge status={restaurant.status} />
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-slate-500">
              📞 {restaurant.phoneNumber || "-"}
            </p>

            <p className="text-sm text-slate-500">
              📍 {restaurant.address?.city || "-"},{" "}
              {restaurant.address?.state || "-"}
            </p>
          </div>

          {restaurant.status === "rejected" && restaurant.rejectionReason && (
            <p className="mt-3 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <strong>Reason:</strong> {restaurant.rejectionReason}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <button
            onClick={onView}
            className="w-full lg:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= STATUS BADGE =================

const StatusBadge = ({ status }) => {
  const styles = {
    approved: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
    pending: "bg-yellow-50 text-yellow-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status || "pending"}
    </span>
  );
};

export default AdminRestaurants;
