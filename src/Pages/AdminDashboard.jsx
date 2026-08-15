import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getRestaurants } from "../Services/adminService";
import { getImageUrl } from "../Services/helper";
import socket from "../socket";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRestaurantNotification, setNewRestaurantNotification] =
    useState(null);

  useEffect(() => {
    socket.connect();

    socket.emit("join:admin");

    socket.on("restaurant:application:new", (data) => {
      setRestaurants((prev) => [data.restaurant, ...prev]);

      setNewRestaurantNotification(data.restaurant);
    });
    return () => {
      socket.off("restaurant:application:new");
      socket.disconnect();
    };
  }, []);

  // ================= FETCH RESTAURANTS =================

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRestaurants();

        setRestaurants(response.restaurants || response || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load restaurants.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // ================= STATS =================

  const totalRestaurants = restaurants.length;

  const pendingRestaurants = restaurants.filter(
    (restaurant) => restaurant.status === "pending",
  ).length;

  const approvedRestaurants = restaurants.filter(
    (restaurant) => restaurant.status === "approved",
  ).length;

  const rejectedRestaurants = restaurants.filter(
    (restaurant) => restaurant.status === "rejected",
  ).length;

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return "bg-green-50 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= SIDEBAR ================= */}

      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:block">
        {/* Logo */}

        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl font-bold text-slate-800">FoodDelivery</h1>

            <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-semibold text-sm">
            <span>📊</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/dashboard/restaurant")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition font-medium text-sm"
          >
            <span>🍽️</span>
            Restaurants
          </button>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}

      <div className="lg:ml-64">
        {/* ================= HEADER ================= */}

        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Dashboard
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage your restaurant platform
              </p>
            </div>

            <div className="flex items-center gap-3">
              {newRestaurantNotification && (
                <div className="relative">
                  <button
                    onClick={() => setNewRestaurantNotification(null)}
                    className="relative w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl hover:bg-orange-100"
                  >
                    🔔
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      1
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <main className="p-4 sm:p-6 lg:p-8">
          {/* ERROR */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* ================= STATS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Total */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Restaurants</p>

                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {totalRestaurants}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                  🍽️
                </div>
              </div>
            </div>

            {/* Pending */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pending</p>

                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {pendingRestaurants}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">
                  ⏳
                </div>
              </div>
            </div>

            {/* Approved */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Approved</p>

                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {approvedRestaurants}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                  ✅
                </div>
              </div>
            </div>

            {/* Rejected */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Rejected</p>

                  <h3 className="text-3xl font-bold text-slate-800 mt-2">
                    {rejectedRestaurants}
                  </h3>
                </div>

                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-2xl">
                  ❌
                </div>
              </div>
            </div>
          </div>

          {/* ================= RESTAURANTS ================= */}

          <section className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            {/* Section Header */}

            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Restaurant Applications
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Review and manage restaurants
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/dashboard/restaurant")}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
              >
                View All
              </button>
            </div>

            {/* ================= TABLE ================= */}

            <div className="overflow-x-auto">
              {restaurants.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-4xl">🍽️</div>

                  <h3 className="mt-3 font-semibold text-slate-700">
                    No restaurants found
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Restaurant applications will appear here.
                  </p>
                </div>
              ) : (
                <table className="w-full min-w-175">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Restaurant
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Owner
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Phone
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Status
                      </th>

                      <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {restaurants.slice(0, 10).map((restaurant) => (
                      <tr
                        key={restaurant._id}
                        className="hover:bg-slate-50 transition"
                      >
                        {/* Restaurant */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center overflow-hidden">
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
                                <span>🍽️</span>
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {restaurant.restaurantName}
                              </p>

                              <p className="text-xs text-slate-400">
                                {restaurant.city ||
                                  restaurant.address?.city ||
                                  "Location unavailable"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Owner */}

                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700">
                            {restaurant.ownerId?.userName ||
                              restaurant.ownerId?.name ||
                              "N/A"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {restaurant.ownerId?.email || ""}
                          </p>
                        </td>

                        {/* Phone */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {restaurant.phoneNumber || "N/A"}
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                              restaurant.status,
                            )}`}
                          >
                            {restaurant.status || "pending"}
                          </span>
                        </td>

                        {/* Action */}

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/dashboard/restaurant/${restaurant._id}`,
                              )
                            }
                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
