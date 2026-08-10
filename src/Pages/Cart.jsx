import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { setCart, clearCartState } from "../redux/cartSlice";
import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../Services/cartService";
import { getImageUrl } from "../Services/helper";

const Cart = () => {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);

  // Get cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);

        const response = await getCart();

        dispatch(setCart(response));
      } catch (error) {
        // Backend empty cart par 404 bhej raha hai
        if (error.response?.status === 404) {
          dispatch(setCart(null));
        } else {
          toast.error(error.response?.data?.message || "Failed to load cart");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [dispatch]);

  // Increase / decrease
  const handleQuantity = async (menuID, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdatingItem(menuID);

      const response = await updateCartItem(menuID, quantity);

      dispatch(setCart(response.cart));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove item
  const handleRemove = async (menuID) => {
    try {
      setUpdatingItem(menuID);

      const response = await removeCartItem(menuID);

      // Backend remove response me cart nahi bhej raha,
      // isliye fresh cart fetch karenge.
      try {
        const cartResponse = await getCart();

        dispatch(setCart(cartResponse));
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(setCart(null));
        }
      }

      toast.success(response.message || "Item removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await clearCart();

      dispatch(clearCartState());

      toast.success("Cart cleared");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="font-body text-text-secondary">Loading cart...</p>
      </div>
    );
  }

  // Empty cart
  if (!cart || cart.items?.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="text-7xl">🛒</div>

          <h1 className="mt-5 font-heading text-3xl font-bold text-text-primary">
            Your Cart is Empty
          </h1>

          <p className="mt-2 font-body text-sm text-text-secondary">
            Add some delicious food to your cart.
          </p>

          <Link
            to="/restaurants"
            className="mt-7 inline-block rounded-xl bg-primary-500 px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-primary-600"
          >
            Explore Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-heading text-3xl font-bold text-text-primary">
            My Cart
          </h1>

          <p className="mt-2 font-body text-sm text-text-secondary">
            Review your items before checkout
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT */}
          <div className="lg:col-span-2">
            {/* Restaurant */}
            <div className="mb-5 rounded-2xl border border-border bg-white p-5">
              <p className="font-body text-xs text-text-secondary">
                Ordering from
              </p>

              <h2 className="mt-1 font-heading text-xl font-bold text-text-primary">
                {cart.restaurantId?.restaurantName}
              </h2>
            </div>

            {/* Items Header */}
            <div className="mb-4 flex items-center justify-between  ">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                Cart Items
              </h2>

              <button
                onClick={handleClearCart}
                className="font-body text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Clear Cart
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4 max-h-52 overflow-scroll scrollbar-none">
              {cart.items.map((item) => {
                const menu = item.menuId;

                return (
                  <div
                    key={menu._id}
                    className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-primary-50 sm:h-28 sm:w-28">
                        {menu.image ? (
                          <img
                            src={getImageUrl(menu.image)}
                            alt={menu.itemName}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";

                              e.currentTarget.nextElementSibling.style.display =
                                "flex";
                            }}
                          />
                        ) : null}

                        <div
                          className={`${
                            menu.image ? "hidden" : "flex"
                          } h-full w-full items-center justify-center font-heading text-3xl font-bold text-primary-500`}
                        >
                          {menu.itemName?.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-heading text-lg font-semibold text-text-primary">
                              {menu.itemName}
                            </h3>

                            <p className="mt-1 font-body text-sm text-text-secondary">
                              ₹{menu.price} each
                            </p>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => handleRemove(menu._id)}
                            disabled={updatingItem === menu._id}
                            className="text-xl text-text-secondary transition hover:text-red-500 disabled:opacity-50"
                            title="Remove item"
                          >
                            ❌
                          </button>
                        </div>

                        {/* Bottom */}
                        <div className="mt-5 flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center rounded-lg border border-border">
                            <button
                              onClick={() =>
                                handleQuantity(menu._id, item.quantity - 1)
                              }
                              disabled={
                                updatingItem === menu._id || item.quantity <= 1
                              }
                              className="px-3 py-1.5 text-lg text-text-primary transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>

                            <span className="min-w-10 text-center font-body text-sm font-semibold text-text-primary">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantity(menu._id, item.quantity + 1)
                              }
                              disabled={updatingItem === menu._id}
                              className="px-3 py-1.5 text-lg text-text-primary transition hover:bg-primary-50 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>

                          {/* Item total */}
                          <p className="font-heading font-bold text-text-primary">
                            ₹{menu.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT - SUMMARY */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-text-primary">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-text-secondary">Items</span>

                  <span className="font-medium text-text-primary">
                    {cart.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </span>
                </div>

                <div className="flex justify-between font-body text-sm">
                  <span className="text-text-secondary">Subtotal</span>

                  <span className="font-medium text-text-primary">
                    ₹{cart.totalAmount}
                  </span>
                </div>

                <div className="flex justify-between font-body text-sm">
                  <span className="text-text-secondary">Delivery Fee</span>

                  <span className="font-medium text-text-primary">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-text-primary">
                      Total
                    </span>

                    <span className="font-heading text-xl font-bold text-primary-500">
                      ₹{cart.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 block w-full rounded-xl bg-primary-500 px-4 py-3 text-center font-body text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Proceed to Checkout
              </Link>

              <Link
                to={`/restaurant/${cart.restaurantId?.slug}`}
                className="mt-3 block text-center font-body text-sm font-medium text-primary-500 hover:text-primary-600"
              >
                ← Add More Items
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
