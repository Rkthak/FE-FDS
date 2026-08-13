import { useEffect, useState } from "react";
import { getRestaurantOrders } from "../Services/order";
import { useNavigate } from "react-router";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRestaurantOrders();

        console.log("Restaurant Orders:", response);

        setOrders(response.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "confirmed":
        return "bg-blue-50 text-blue-700";

      case "preparing":
        return "bg-orange-50 text-orange-700";

      case "ready":
        return "bg-green-50 text-green-700";

      case "out for delivery":
        return "bg-purple-50 text-purple-700";

      case "delivered":
        return "bg-emerald-50 text-emerald-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className=" bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Orders</h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your restaurant orders
            </p>
          </div>

          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold">
            {orders.length} Orders
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="p-4 sm:p-6 lg:p-8">
        {/* ================= LOADING ================= */}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

            <p className="text-sm text-slate-500 mt-4">Loading orders...</p>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>

            <h3 className="font-semibold text-slate-800">
              Something went wrong
            </h3>

            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">📦</div>

            <h3 className="text-lg font-semibold text-slate-800">
              No Orders Yet
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Your restaurant orders will appear here.
            </p>
          </div>
        )}

        {/* ================= ORDERS ================= */}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5"
              >
                {/* TOP */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">ORDER ID</p>

                    <h3 className="font-bold text-slate-800 mt-1">
                      #{order._id.slice(-8).toUpperCase()}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.orderStatus}
                    </span>

                    <span className="text-xs text-slate-400">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>

                {/* DIVIDER */}

                <div className="border-t border-slate-100 my-4" />

                {/* ORDER INFO */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* CUSTOMER */}

                  <div>
                    <p className="text-xs text-slate-400">Customer</p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {order.userId?.userName || "Customer"}
                    </p>
                  </div>

                  {/* ITEMS */}

                  <div>
                    <p className="text-xs text-slate-400">Items</p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {order.items?.length || 0} Items
                    </p>
                  </div>

                  {/* TOTAL */}

                  <div>
                    <p className="text-xs text-slate-400">Total Amount</p>

                    <p className="text-sm font-bold text-slate-800 mt-1">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}

                <div className="border-t border-slate-100 mt-4 pt-4 flex justify-end">
                  <button
                    onClick={() =>
                      navigate(`/restaurant/dashboard/orders/${order._id}`)
                    }
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                  >
                    View Order →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantOrders;
