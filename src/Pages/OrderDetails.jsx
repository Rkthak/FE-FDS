import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getOrderById } from "../Services/order";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orderID } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderID);
        setOrder(response.order);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderID]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white shadow-sm" />
          <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">📦</div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Order not found
          </h2>

          <button
            onClick={() => navigate("/orders")}
            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/orders")}
            className="mb-4 text-sm font-medium text-gray-500 hover:text-orange-500"
          >
            ← Back to Orders
          </button>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Order ID: #{order._id}
              </p>
            </div>

            <span className="w-fit rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold capitalize text-orange-600">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Restaurant + Payment */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Restaurant
            </p>

            <h2 className="mt-2 text-lg font-bold text-gray-900 capitalize">
              {order.restaurantId?.restaurantName || "Restaurant"}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Payment
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold capitalize text-gray-900">
                {order.paymentMethod}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-600">
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Order Items</h2>

          <div className="mt-5 divide-y divide-gray-100">
            {order.items?.map((item) => (
              <div
                key={item._id || item.menuId}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {item.itemName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.quantity} × ₹{item.price}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-5">
            <span className="text-base font-semibold text-gray-700">
              Total Amount
            </span>

            <span className="text-xl font-bold text-gray-900">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Address
            </h2>

            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900 capitalize">
                {order.deliveryAddress.landmark || "Delivery Address"}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500 capitalize">
                {order.deliveryAddress.fullAddress}
              </p>

              <p className="mt-1 text-sm text-gray-500 capitalize">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                {order.deliveryAddress.pincode}
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Order Status</h2>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              ✓
            </div>

            <div>
              <p className="font-semibold capitalize text-gray-900">
                {order.orderStatus?.replaceAll("_", " ")}
              </p>

              <p className="text-sm text-gray-500">
                Your order status will update here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
