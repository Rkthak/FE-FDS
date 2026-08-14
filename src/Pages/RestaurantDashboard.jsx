import { useEffect, useState } from "react";
import { getMyRestaurant } from "../Services/restaurant";
import { getRestaurantOrders } from "../Services/order";
import { useNavigate } from "react-router";

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);

        const response = await getMyRestaurant();

        // Store all restaurants
        setRestaurants(response);

        // Select first restaurant
        if (response.length > 0) {
          setSelectedRestaurant(response[0]);
        }
      } catch (error) {
        setError("Unable to load restaurant details.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  // orgers getting
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError("");

        const response = await getRestaurantOrders();

        setOrders(response.orders);
      } catch (error) {
        console.error("Failed to fetch restaurant orders:", error);

        setOrdersError("Unable to load orders.");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading restaurant...
          </p>

          <p className="mt-1 text-xs text-slate-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-red-100 rounded-2xl p-6 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          w-64 bg-slate-900 text-white flex flex-col
          fixed top-21 sm:top-21 left-0 bottom-0 z-50
          transform transition-transform duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ================= RESTAURANT SELECTOR ================= */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-lg shrink-0">
                🏪
              </div>

              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs text-slate-400">Restaurant</p>

                <p className="text-sm font-semibold text-white truncate">
                  {selectedRestaurant?.restaurantName || "Select Restaurant"}
                </p>
              </div>

              <span
                className={`text-xs text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {/* ================= DROPDOWN ================= */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-60 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Select Restaurant
                  </p>
                </div>

                <div className="p-2 max-h-60 overflow-y-auto">
                  {restaurants.length > 0 ? (
                    restaurants.map((restaurant) => {
                      const isSelected =
                        selectedRestaurant?._id === restaurant._id;

                      return (
                        <button
                          key={restaurant._id}
                          onClick={() => {
                            setSelectedRestaurant(restaurant);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                            isSelected ? "bg-orange-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            🍽️
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isSelected
                                  ? "text-orange-600"
                                  : "text-slate-800"
                              }`}
                            >
                              {restaurant.restaurantName}
                            </p>

                            <p className="text-xs text-slate-400 capitalize">
                              {restaurant.status}
                            </p>
                          </div>

                          {isSelected && (
                            <span className="text-orange-500 font-bold">✓</span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">
                      No restaurants found
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="p-4 flex-1 overflow-y-auto scrollbar-thumb-orange-500">
          <div className="flex items-center justify-between px-3 mb-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Main Menu
            </p>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white"
          >
            <span>📊</span>
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate("/restaurant/dashboard/orders");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 mt-2"
          >
            <span>📦</span>
            <span>Orders</span>

            <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate("/restaurant/dashboard/menu");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 mt-2"
          >
            <span>🍔</span>
            <span>Menu</span>
          </button>

          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mt-8 mb-3">
            Restaurant
          </p>

          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate(
                `/restaurant/dashboard/edit/${selectedRestaurant?.slug}`,
              );
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
          >
            <span>🏪</span>
            <span>Restaurant Profile</span>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 mt-2"
          >
            <span>⭐</span>
            <span>Reviews</span>
          </button>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="lg:ml-64 min-h-screen">
        {/* ================= HEADER ================= */}
        <header className="h-16 sm:h-20 bg-white border-b px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 shrink-0"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Dashboard
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 truncate">
                Manage your restaurant and orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-green-50 border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500" />

              <span className="text-sm font-medium text-green-700">Open</span>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <div className="p-4 sm:p-5 lg:p-8">
          {/* Restaurant Banner */}
          <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-5 sm:p-7 mb-5 sm:mb-7">
            <div className="relative z-10 max-w-xl">
              <p className="text-orange-400 text-xs sm:text-sm font-semibold mb-2">
                WELCOME BACK 👋
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold mb-2 capitalize wrap-break-words">
                {selectedRestaurant?.restaurantName || "Your Restaurant"}
              </h1>

              <p className="text-slate-300 text-sm leading-6 max-w-lg">
                Manage orders, update your menu and keep your customers happy
                from one place.
              </p>

              <button
                className="mt-4 sm:mt-5 bg-orange-500 hover:bg-orange-600 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold"
                onClick={() =>
                  navigate(
                    `/restaurant/dashboard/edit/${selectedRestaurant.slug}`,
                  )
                }
              >
                Manage Restaurant
              </button>
            </div>

            <div className="absolute -right-20 -top-20 w-52 sm:w-64 h-52 sm:h-64 rounded-full bg-orange-500/20" />

            <div className="absolute right-5 sm:right-20 -bottom-32 w-60 sm:w-72 h-60 sm:h-72 rounded-full bg-orange-500/10" />
          </section>

          {/* ================= STATS ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-5 sm:mb-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm text-slate-500">Total Orders</p>

                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                    {orders.length}
                  </h3>
                </div>

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 flex items-center justify-center text-lg sm:text-xl shrink-0">
                  📦
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm text-slate-500">Pending Orders</p>

                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                    {
                      orders.filter((order) => order.orderStatus === "pending")
                        .length
                    }
                  </h3>
                </div>

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-yellow-50 flex items-center justify-center text-lg sm:text-xl shrink-0">
                  ⏳
                </div>
              </div>

              <p className="text-xs text-orange-600 mt-4">
                Need your attention
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm text-slate-500">Restaurant Rating</p>

                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
                    {selectedRestaurant?.rating}
                  </h3>
                </div>

                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 flex items-center justify-center text-lg sm:text-xl shrink-0">
                  ⭐
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Based on {selectedRestaurant?.totalReviews} reviews
              </p>
            </div>
          </section>

          {/* ================= BOTTOM GRID ================= */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-5 border-b flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800">Recent Orders</h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Your latest customer orders
                  </p>
                </div>

                <button
                  className="text-sm text-orange-500 font-semibold whitespace-nowrap"
                  onClick={() => navigate("/restaurant/dashboard/orders")}
                >
                  View All →
                </button>
              </div>

              <div className="divide-y">
                {ordersLoading ? (
                  <div className="p-6 text-center text-slate-500">
                    Loading orders...
                  </div>
                ) : ordersError ? (
                  <div className="p-6 text-center text-red-500">
                    {ordersError}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    No orders yet.
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {order.userId?.userName || "Customer"} •{" "}
                          {order.items?.length || 0} Items
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-semibold">₹{order.totalAmount}</p>

                        <span className="inline-block mt-1 text-xs text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
              <h3 className="font-bold text-slate-800">Quick Actions</h3>

              <p className="text-xs text-slate-500 mt-1 mb-5">
                Manage your restaurant quickly
              </p>

              <div className="space-y-3">
                <button
                  className="w-full flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-left"
                  onClick={() => navigate("/restaurant/dashboard/menu/create")}
                >
                  <span className="text-xl">➕</span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Add Menu Item
                    </p>

                    <p className="text-xs text-slate-500">Add a new dish</p>
                  </div>
                </button>

                <button
                  className="w-full flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left"
                  onClick={() => navigate("/restaurant/dashboard/orders")}
                >
                  <span className="text-xl">📋</span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      View Orders
                    </p>

                    <p className="text-xs text-slate-500">
                      Manage incoming orders
                    </p>
                  </div>
                </button>

                <button
                  className="w-full flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left"
                  onClick={() =>
                    navigate(
                      `/restaurant/dashboard/edit/${selectedRestaurant.slug}`,
                    )
                  }
                >
                  <span className="text-xl">🏪</span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Edit Restaurant
                    </p>

                    <p className="text-xs text-slate-500">
                      Update restaurant details
                    </p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left">
                  <span className="text-xl">⭐</span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Customer Reviews
                    </p>

                    <p className="text-xs text-slate-500">Check your reviews</p>
                  </div>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboard;
