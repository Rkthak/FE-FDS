import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getRestaurantBySlug,
  getRestaurantMenus,
} from "../Services/restaurant";
import { getImageUrl } from "../Services/helper";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { addToCart } from "../Services/cartService";
import { toast } from "react-toastify";

const RestaurantDetails = () => {
  const { slugID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [restaurant, setRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRestaurantBySlug(slugID);
        const menuResponse = await getRestaurantMenus(response.data._id);
        console.log("menu", menuResponse);

        setRestaurant(response.data);
        setMenus(menuResponse.data.menus || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load restaurant");
        if (error.response?.status === 404) {
          navigate("/404");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slugID, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="font-body text-text-secondary">Loading restaurant...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="font-body text-red-500">{error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="font-body text-text-secondary">Restaurant not found</p>
      </div>
    );
  }

  // ADD IN CART

  const handleAddToCart = async (menuID) => {
    try {
      const response = await addToCart(menuID, 1);

      dispatch(setCart(response.cart));

      toast.success("Item added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);

      toast.error(
        error.response?.data?.message || "Failed to add item to cart",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Restaurant Banner */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        {restaurant.banner ? (
          <img
            src={`${getImageUrl(restaurant.banner)}`}
            alt={restaurant.restaurantName}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-50">
            <span className="text-5xl">🍽️</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Restaurant Info */}
      <div className="mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-white p-5 shadow-lg sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Logo */}
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-primary-50 shadow-md">
              {restaurant.logo ? (
                <img
                  src={`${getImageUrl(restaurant.logo)}`}
                  alt={restaurant.restaurantName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  🍕
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl capitalize">
                {restaurant.restaurantName}
              </h1>

              <p className="mt-2 font-body text-sm text-text-secondary">
                {restaurant.description}
              </p>

              {/* Meta */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="font-body text-text-primary">
                  ⭐ {restaurant.rating || "New"}
                </span>

                <span className="font-body text-text-secondary">
                  🕐 {restaurant.deliveryTime || "30-40 min"}
                </span>

                <span className="font-body text-text-secondary">
                  🚚 ₹{restaurant.deliveryFee || 0}
                </span>

                <span className="font-body text-text-secondary">
                  {restaurant.priceRange || "₹₹"}
                </span>
              </div>

              {/* Cuisine */}
              {restaurant.cuisine?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.cuisine.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Open Status */}
            <div>
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  restaurant.isOpen
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {restaurant.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            Menu
          </h2>

          <p className="mt-1 font-body text-sm text-text-secondary">
            Choose your favorite dishes
          </p>
        </div>

        {menus.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center">
            <p className="font-body text-text-secondary">
              No menu items available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {menus.map((menu) => (
              <div
                key={menu._id}
                className="flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* Menu Image */}
                <div className="h-28 w-28 overflow-hidden rounded-xl bg-primary-50">
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

                {/* Menu Info */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold text-text-primary capitalize">
                      {menu.itemName}
                    </h3>

                    <span
                      className={`h-fit rounded-full px-2 py-1 text-[10px] font-semibold ${
                        menu.isAvailable
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {menu.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 font-body text-sm text-text-secondary">
                    {menu.description || "Delicious food item"}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-heading text-lg font-bold text-primary-500">
                      ₹{menu.price}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(menu._id)}
                      disabled={!menu.isAvailable}
                      className="rounded-xl bg-primary-500 px-4 py-2 font-body text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;
