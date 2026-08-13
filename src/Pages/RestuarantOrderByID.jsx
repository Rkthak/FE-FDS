import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getRestaurantOrderById, updateOrderStatus } from "../Services/order";

const RestaurantOrderDetails = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // updating
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);

      const response = await updateOrderStatus(order._id, status);

      setOrder(response.order || response);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRestaurantOrderById(orderID);

        console.log("Order Details:", response);

        setOrder(response.order);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderID]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "preparing":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "ready":
        return "bg-green-50 text-green-700 border-green-200";

      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-4">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-lg font-bold text-slate-800">
            Something went wrong
          </h2>

          <p className="text-sm text-red-500 mt-2">{error}</p>

          <button
            onClick={() => navigate("/restaurant/dashboard/orders")}
            className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/restaurant/dashboard/orders")}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
            >
              ←
            </button>

            <div>
              <p className="text-xs text-slate-400">ORDER DETAILS</p>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                #{order._id.slice(-8).toUpperCase()}
              </h1>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getStatusStyle(
              order.orderStatus,
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* ================= LEFT ================= */}

          <div className="xl:col-span-2 space-y-5">
            {/* CUSTOMER */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800">Customer Information</h2>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-slate-400">Customer Name</p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {order.userId?.userName || "Customer"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Phone</p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {order.userId?.phoneNumber || "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* ORDER ITEMS */}

            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">Order Items</h2>

                <p className="text-xs text-slate-500 mt-1">
                  {order.items?.length || 0} items in this order
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
                        🍔
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {item.menuId?.itemName ||
                            item.menuId?.name ||
                            "Menu Item"}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold text-slate-800 shrink-0">
                      ₹
                      {(
                        (item.price || item.menuId?.price || 0) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* DELIVERY ADDRESS */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800">Delivery Address</h2>

              <div className="mt-4 bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600">
                  {order?.deliveryAddress?.fullAddress}
                </p>

                <p className="text-sm text-slate-600">
                  {order?.deliveryAddress?.city},{" "}
                  {order?.deliveryAddress?.state} -{" "}
                  {order?.deliveryAddress?.pincode}
                </p>
              </div>
            </section>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="space-y-5">
            {/* PAYMENT */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800">Payment</h2>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Method</span>

                  <span className="font-semibold text-slate-800 uppercase">
                    {order.paymentMethod || "COD"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Status</span>

                  <span className="font-semibold text-green-600 capitalize">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>
            </section>

            {/* PRICE SUMMARY */}

            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-slate-800">Order Summary</h2>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Items Total</span>

                  <span className="font-medium">
                    ₹{order.itemsTotal || order.totalAmount || 0}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery Fee</span>

                  <span className="font-medium">₹{order.deliveryFee || 0}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="font-bold text-slate-800">Total</span>

                  <span className="text-lg font-bold text-orange-500">
                    ₹{order.totalAmount || 0}
                  </span>
                </div>
              </div>
            </section>

            {/* ORDER DATE */}

            <section className="bg-slate-900 text-white rounded-2xl p-5">
              <p className="text-xs text-slate-400">ORDER PLACED</p>

              <p className="font-semibold mt-2">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Date not available"}
              </p>
            </section>

            <div className="flex flex-wrap gap-3">
              {/* Pending → Confirmed */}
              {order.orderStatus === "pending" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate("confirmed")}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Confirm Order"}
                </button>
              )}

              {/* Confirmed → Preparing */}
              {order.orderStatus === "confirmed" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate("preparing")}
                  className="px-4 py-2 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Start Preparing"}
                </button>
              )}

              {/* Preparing → Out for Delivery */}
              {order.orderStatus === "preparing" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate("out_for_delivery")}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white font-medium disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Out for Delivery"}
                </button>
              )}

              {/* Out for Delivery → Delivered */}
              {order.orderStatus === "out_for_delivery" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate("delivered")}
                  className="px-4 py-2 rounded-xl bg-green-500 text-white font-medium disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Mark Delivered"}
                </button>
              )}

              {["pending", "confirmed", "preparing"].includes(
                order.orderStatus,
              ) && (
                <button
                  disabled={updating}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to cancel this order?",
                      )
                    ) {
                      handleStatusUpdate("cancelled");
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50"
                >
                  {updating ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantOrderDetails;
