import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCart } from "../Services/cartService";
import { getMe } from "../Services/authService";
import { placeOrder } from "../Services/order";
import { createPayment, verifyPayment } from "../Services/payment";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);

        const [cartResponse, userResponse] = await Promise.all([
          getCart(),
          getMe(),
        ]);

        setCart(cartResponse);
        setUser(userResponse.user);

        // addresses is a single object
        setSelectedAddress(userResponse.user?.addresses || null);
      } catch (error) {
        setError(error?.response?.data?.message || "Unable to load checkout.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  // RAZORPAY INTEGRATION checkout
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    if (placingOrder) return;

    try {
      setPlacingOrder(true);
      setError("");

      if (paymentMethod === "COD") {
        const data = await placeOrder();

        navigate(`/order/${data.order._id}`);
        return;
      }

      const paymentData = await createPayment();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_TEST_API_KEY,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Food Delivery",
        description: "Food Order Payment",
        order_id: paymentData.razorpayOrderId,

        handler: async function (response) {
          try {
            const verifyData = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            navigate(`/order/${verifyData.order._id}`);
          } catch (error) {
            setError(
              error?.response?.data?.message || "Payment verification failed.",
            );
            setPlacingOrder(false);
          }
        },

        prefill: {
          name: user?.userName || "",
          contact: user?.phoneNumber || "",
        },

        theme: {
          color: "#f97316",
        },

        modal: {
          ondismiss: function () {
            setPlacingOrder(false);
            setError("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      setError(error?.response?.data?.message || "Unable to place order.");
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-64 rounded-2xl bg-gray-200" />
              <div className="h-40 rounded-2xl bg-gray-200" />
            </div>

            <div className="h-96 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-5xl">🛒</div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add some delicious food before checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-5 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.menuId.price * item.quantity,
    0,
  );

  const deliveryFee = cart.deliveryFee || 0;

  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

          <p className="mt-1 text-sm text-gray-500">Complete your order</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Delivery Address
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select an address for delivery
                </p>
              </div>

              <div>
                {user?.addresses ? (
                  <label className="block rounded-xl border border-orange-500 bg-orange-50 p-4">
                    <div className="flex gap-4">
                      <input
                        type="radio"
                        name="address"
                        checked
                        readOnly
                        className="mt-1 h-4 w-4 accent-orange-500"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold text-gray-900">
                            {user.addresses.landmark || "Delivery Address"}
                          </h3>

                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
                            Selected
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {user.addresses.fullAddress}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {user.addresses.city}, {user.addresses.state} -{" "}
                          {user.addresses.pincode}
                        </p>

                        {/* Edit Address */}
                        <button
                          type="button"
                          onClick={() => navigate("/profile")}
                          className="mt-3 text-sm font-semibold text-orange-500 hover:text-orange-600"
                        >
                          Edit Address
                        </button>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="rounded-xl bg-gray-50 p-5 text-center">
                    <p className="text-sm text-gray-500">
                      No delivery address found.
                    </p>

                    <button
                      onClick={() => navigate("/profile")}
                      className="mt-3 text-sm font-semibold text-orange-500 hover:text-orange-600"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Payment Method
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose your payment method
              </p>

              <div className="mt-5 space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-orange-500"
                  />

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-xl">
                    💵
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Cash on Delivery
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                {/* Online Payment */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "ONLINE"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-orange-500"
                  />

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-xl">
                    💳
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Online Payment
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Pay securely using online payment.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              {/* Restaurant */}
              {cart.restaurantId?.restaurantName && (
                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Restaurant</p>

                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {cart.restaurantId.restaurantName}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="mt-5 space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.menuId.itemName}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.quantity} × ₹{item.menuId.price}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-gray-800">
                      ₹{item.menuId.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium text-gray-800">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>

                  <span className="font-medium text-gray-800">
                    ₹{deliveryFee}
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-4">
                  <span className="font-semibold text-gray-900">Total</span>

                  <span className="text-xl font-bold text-gray-900">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Place Order */}
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || !selectedAddress}
                className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {placingOrder ? "Placing Order..." : `Place Order · ₹${total}`}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Your order will be placed with {paymentMethod}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
