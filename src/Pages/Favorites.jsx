import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
  getFavoriteMenus,
  getFavoriteRestaurants,
} from "../Services/favService";
import { getImageUrl } from "../Services/helper";

const Favorites = () => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteMenus, setFavoriteMenus] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch Favorites

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);

        const [restaurantResponse, menuResponse] = await Promise.all([
          getFavoriteRestaurants(),
          getFavoriteMenus(),
        ]);

        setFavoriteRestaurants(restaurantResponse.favoriteRestaurants || []);

        setFavoriteMenus(menuResponse.favoriteFoods || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load favorites",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ===============================
  // Loading
  // ===============================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500" />

          <p className="mt-4 font-body text-sm text-text-secondary">
            Loading your favorites...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* =====================================
          HEADER
      ====================================== */}

      <section className="bg-primary-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-body text-sm font-semibold text-primary-500">
            Your Collection
          </p>

          <h1 className="mt-1 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
            Favorites ❤️
          </h1>

          <p className="mt-2 max-w-xl font-body text-sm text-text-secondary">
            Keep your favorite restaurants and dishes close at hand.
          </p>
        </div>
      </section>

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* =====================================
            FAVORITE RESTAURANTS
        ====================================== */}

        <section>
          {/* Section Header */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">
                Favorite Restaurants
              </h2>

              <p className="mt-1 font-body text-sm text-text-secondary">
                Restaurants you love the most.
              </p>
            </div>

            <Link
              to="/restaurants"
              className="font-body text-sm font-semibold text-primary-500 transition hover:text-primary-600"
            >
              Explore Restaurants →
            </Link>
          </div>

          {/* No Restaurants */}

          {favoriteRestaurants.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-border bg-white px-6 py-12 text-center">
              <div className="text-6xl">❤️</div>

              <h3 className="mt-4 font-heading text-xl font-bold text-text-primary">
                No favorite restaurants yet
              </h3>

              <p className="mx-auto mt-2 max-w-md font-body text-sm text-text-secondary">
                Save restaurants you love and they will appear here for quick
                access.
              </p>

              <Link
                to="/restaurants"
                className="mt-6 inline-flex rounded-xl bg-primary-500 px-5 py-3 font-body text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Find Restaurants
              </Link>
            </div>
          ) : (
            /* Restaurant Cards */

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteRestaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurant/${restaurant.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Restaurant Image */}

                  <div className="relative h-44 overflow-hidden bg-primary-50">
                    {restaurant.logo ? (
                      <img
                        src={getImageUrl(restaurant.logo)}
                        alt={restaurant.restaurantName}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    {/* Image Fallback */}

                    <div
                      className={`${
                        restaurant.logo ? "hidden" : "flex"
                      } h-full w-full items-center justify-center text-5xl font-bold text-primary-500`}
                    >
                      {restaurant.restaurantName?.charAt(0).toUpperCase()}
                    </div>

                    {/* Favorite Badge */}

                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow">
                      ❤️
                    </div>
                  </div>

                  {/* Restaurant Details */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-heading text-lg font-bold text-text-primary">
                        {restaurant.restaurantName}
                      </h3>

                      <span className="shrink-0 rounded-lg bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        ⭐ {restaurant.rating || "New"}
                      </span>
                    </div>

                    {/* Cuisine */}

                    {restaurant.cuisine?.length > 0 && (
                      <p className="mt-2 line-clamp-1 font-body text-sm text-text-secondary">
                        {restaurant.cuisine.join(" • ")}
                      </p>
                    )}

                    {/* Address */}

                    {restaurant.address?.city && (
                      <p className="mt-2 flex items-center gap-1 font-body text-xs text-text-secondary">
                        📍 {restaurant.address.city}
                      </p>
                    )}

                    {/* View */}

                    <div className="mt-4 font-body text-sm font-semibold text-primary-500">
                      View Restaurant →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =====================================
            FAVORITE FOODS
        ====================================== */}

        <section className="mt-14">
          {/* Section Header */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">
                Favorite Foods
              </h2>

              <p className="mt-1 font-body text-sm text-text-secondary">
                Dishes you have saved for later.
              </p>
            </div>

            <Link
              to="/restaurants"
              className="font-body text-sm font-semibold text-primary-500 transition hover:text-primary-600"
            >
              Find More Food →
            </Link>
          </div>

          {/* No Foods */}

          {favoriteMenus.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-border bg-white px-6 py-12 text-center">
              <div className="text-6xl">🍽️</div>

              <h3 className="mt-4 font-heading text-xl font-bold text-text-primary">
                No favorite foods yet
              </h3>

              <p className="mx-auto mt-2 max-w-md font-body text-sm text-text-secondary">
                Save your favorite dishes and order them whenever you want.
              </p>

              <Link
                to="/restaurants"
                className="mt-6 inline-flex rounded-xl bg-primary-500 px-5 py-3 font-body text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Explore Food
              </Link>
            </div>
          ) : (
            /* Food Cards */

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteMenus.map((menu) => (
                <div
                  key={menu._id}
                  className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-200 hover:shadow-md"
                >
                  {/* Food Image */}

                  <div className="relative h-48 overflow-hidden bg-primary-50">
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

                    {/* Image Fallback */}

                    <div
                      className={`${
                        menu.image ? "hidden" : "flex"
                      } h-full w-full items-center justify-center text-5xl font-bold text-primary-500`}
                    >
                      {menu.itemName?.charAt(0).toUpperCase()}
                    </div>

                    {/* Favorite */}

                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow">
                      ❤️
                    </div>

                    {/* Veg / Non Veg */}

                    <div className="absolute bottom-3 left-3 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold shadow">
                      {menu.isVeg ? (
                        <span className="text-success">🟢 Veg</span>
                      ) : (
                        <span className="text-error">🔴 Non-Veg</span>
                      )}
                    </div>
                  </div>

                  {/* Food Details */}

                  <div className="p-4">
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                      {menu.itemName}
                    </h3>

                    {/* Description */}

                    {menu.description && (
                      <p className="mt-1 line-clamp-2 font-body text-sm text-text-secondary">
                        {menu.description}
                      </p>
                    )}

                    {/* Restaurant */}

                    {menu.restaurantId && (
                      <Link
                        to={`/restaurant/${menu.restaurantId.slug}`}
                        className="mt-3 block font-body text-xs font-semibold text-primary-500 transition hover:text-primary-600"
                      >
                        {menu.restaurantId.restaurantName}
                      </Link>
                    )}

                    {/* Price + Action */}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-heading text-lg font-bold text-text-primary">
                        ₹{menu.price}
                      </span>

                      {!menu.isAvailable ? (
                        <span className="rounded-xl bg-gray-100 px-3 py-2 font-body text-xs font-semibold text-gray-500">
                          Unavailable
                        </span>
                      ) : (
                        <Link
                          to={`/restaurant/${menu.restaurantId?.slug}`}
                          className="rounded-xl bg-primary-500 px-4 py-2 font-body text-xs font-semibold text-white transition hover:bg-primary-600"
                        >
                          View
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Favorites;
