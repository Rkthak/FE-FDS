import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAllMenus } from "../Services/menuService";
import { getImageUrl } from "../Services/helper";

const AllMenus = () => {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getAllMenus();

        setMenus(response || []);
      } catch {
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-text-secondary">Loading menus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-heading text-sm font-semibold text-primary-500">
            Explore Food
          </p>

          <h1 className="mt-1 font-logo text-3xl font-black text-text-primary sm:text-4xl">
            All Menus
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            Discover delicious dishes from approved restaurants.
          </p>
        </div>

        {/* Empty State */}
        {menus.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface p-12 text-center">
            <div className="text-5xl">🍽️</div>

            <h2 className="mt-4 font-heading text-xl font-bold text-text-primary">
              No menus available
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              There are no available menu items right now.
            </p>
          </div>
        ) : (
          /* Menu Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {menus.map((menu) => {
              const restaurant = menu.restaurantId;

              return (
                <div
                  key={menu._id}
                  className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-background">
                    {menu.menuImage ? (
                      <img
                        src={getImageUrl(menu.menuImage)}
                        alt={menu.itemName}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl">
                        🍽️
                      </div>
                    )}

                    {/* Availability */}
                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                        menu.isAvailable
                          ? "bg-success/10 text-success"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {menu.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="line-clamp-1 font-heading text-lg font-bold text-text-primary">
                        {menu.itemName}
                      </h2>

                      <span className="shrink-0 font-heading text-lg font-bold text-primary-500">
                        ₹{menu.price}
                      </span>
                    </div>

                    {menu.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">
                        {menu.description}
                      </p>
                    )}

                    {/* Restaurant */}
                    {restaurant && (
                      <div className="mt-4 border-t border-border pt-4">
                        <div className="flex items-center gap-3">
                          {restaurant.logo ? (
                            <img
                              src={getImageUrl(restaurant.logo)}
                              alt={restaurant.restaurantName}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
                              🍴
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-text-primary">
                              {restaurant.restaurantName}
                            </p>

                            {restaurant.address?.city && (
                              <p className="truncate text-xs text-text-muted">
                                {restaurant.address.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Button */}
                    <button
                      type="button"
                      onClick={() => navigate(`/menu/${menu._id}`)}
                      className="mt-5 w-full rounded-xl bg-primary-500 px-4 py-3 text-sm font-bold text-text-white transition hover:bg-primary-600"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMenus;
