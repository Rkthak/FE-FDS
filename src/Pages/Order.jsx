import { useEffect, useState } from "react";
import { cancelOrder, getMyOrders } from "../Services/order";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "preparing":
        return "bg-orange-100 text-orange-700";

      case "ready":
        return "bg-purple-100 text-purple-700";

      case "out_for_delivery":
        return "bg-indigo-100 text-indigo-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="h-5 w-40 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-60 rounded bg-gray-200" />
                <div className="mt-3 h-4 w-32 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // cancel order
  const handleCancelOrder = async (orderID) => {
    try {
      await cancelOrder(orderID);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderID
            ? { ...order, orderStatus: "cancelled" }
            : order,
        ),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track and manage all your food orders
          </p>
        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl bg-white px-6 text-center shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-4xl">
              🍽️
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              You haven't placed any orders yet. Explore restaurants and order
              your favorite food.
            </p>

            <button
              className="mt-6 rounded-lg cursor-pointer bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              onClick={() => navigate("/restaurants")}
            >
              Explore Restaurants
            </button>
          </div>
        ) : (
          /* Orders */
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Restaurant
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-gray-900 capitalize">
                      {order.restaurantId?.restaurantName || "Restaurant"}
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Order ID: #{order._id.slice(-8)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-sm font-semibold text-orange-600">
                            {item.quantity}×
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-800 capitalize">
                              {item.itemName}
                            </p>

                            <p className="text-xs text-gray-400">
                              ₹{item.price} each
                            </p>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-gray-800">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          ₹{order.totalAmount}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Payment</p>

                        <p className="mt-1 text-sm font-semibold text-gray-700">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        View Details
                      </button>

                      {order.orderStatus === "pending" && (
                        <button
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-error transition hover:bg-red-50"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              View your previous payments and transactions.
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-xl">
            💳
          </div>
        </div>

        <button
          onClick={() => navigate("/payment-history")}
          className="mt-4 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-text-white transition hover:bg-primary-600"
        >
          View Payment History →
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
