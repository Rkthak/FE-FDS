import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllRestaurant } from "../Services/restaurant";
import { formatTime, getImageUrl } from "../Services/helper";

const GetAllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllRestaurant();

        setRestaurants(response.restaurants || []);
      } catch (error) {
        console.error("Restaurant error:", error);

        setError(error.response?.data?.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="font-body text-text-secondary">Loading restaurants...</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-body text-sm font-semibold uppercase tracking-wider text-primary-500">
            FoodRush
          </p>

          <h1 className="mt-2 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
            Explore Restaurants
          </h1>

          <p className="mt-3 max-w-2xl font-body text-text-secondary">
            Discover the best restaurants around you and order your favorite
            food.
          </p>
        </div>
      </section>

      {/* Restaurants */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-text-primary">
            All Restaurants
          </h2>

          <span className="font-body text-sm text-text-secondary">
            {restaurants.length} restaurants
          </span>
        </div>

        {restaurants.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-12 text-center">
            <div className="text-5xl">🍽️</div>

            <h3 className="mt-4 font-heading text-xl font-semibold text-text-primary">
              No restaurants available
            </h3>

            <p className="mt-2 font-body text-sm text-text-secondary">
              There are no approved restaurants available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Restaurant Image */}
                <div className="relative h-52 w-full overflow-hidden bg-primary-50">
                  {restaurant.banner ? (
                    <img
                      src={getImageUrl(restaurant.banner)}
                      alt={restaurant.restaurantName}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display =
                          "flex";
                      }}
                    />
                  ) : (
                    <div
                      className={`${
                        restaurant.banner ? "hidden" : "flex"
                      } h-full w-full items-center justify-center`}
                    >
                      <span className="text-6xl">🍽️</span>
                    </div>
                  )}

                  {/* Open / Closed */}
                  <div className="absolute right-3 top-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow ${
                        restaurant.isOpen
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {restaurant.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Logo + Name */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary-50">
                      {restaurant.logo ? (
                        <img
                          src={getImageUrl(restaurant.logo)}
                          alt={restaurant.restaurantName}
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
                          restaurant.logo ? "hidden" : "flex"
                        } h-full w-full items-center justify-center font-heading text-xl font-bold text-primary-500`}
                      >
                        {restaurant.restaurantName?.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-lg font-bold text-text-primary capitalize">
                        {restaurant.restaurantName}
                      </h3>

                      <p className="font-body text-xs text-text-secondary">
                        {`${formatTime(restaurant.openingHours.open)} - ${formatTime(
                          restaurant.openingHours.close,
                        )}`}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 line-clamp-2 font-body text-sm text-text-secondary">
                    {restaurant.description ||
                      "Delicious food waiting for you."}
                  </p>

                  {/* Cuisine */}
                  {restaurant.cuisine?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {restaurant.cuisine.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Restaurant Info */}
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4">
                    <span className="font-body text-sm text-text-primary">
                      ⭐ {restaurant.rating || "New"}
                    </span>

                    <span className="font-body text-sm text-text-secondary">
                      🕐 {restaurant.deliveryTime || "30-40 min"}
                    </span>

                    <span className="font-body text-sm text-text-secondary">
                      🚚 ₹{restaurant.deliveryFee || 0}
                    </span>
                  </div>

                  {/* View Menu */}
                  <Link
                    to={`/restaurant/${restaurant.slug}`}
                    className="mt-5 block w-full rounded-xl bg-primary-500 px-4 py-3 text-center font-body text-sm font-semibold text-white transition hover:bg-primary-600"
                  >
                    View Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GetAllRestaurants;
