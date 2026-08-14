import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getAllRestaurant } from "../Services/restaurant";
import { getAllMenus } from "../Services/menuService";
import { getImageUrl } from "../Services/helper";
import { toast } from "react-toastify";

const categoryIcons = {
  Pizza: "🍕",
  Burger: "🍔",
  Biryani: "🍛",
  Chinese: "🥡",
  Indian: "🍲",
  SouthIndian: "🥘",
  Desserts: "🍰",
  Drinks: "🥤",
  Snacks: "🍟",
  default: "🍽️",
};

const Home = () => {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurant();

        setRestaurants(data.restaurants || []);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setRestaurantLoading(false);
      }
    };

    const fetchMenus = async () => {
      try {
        const data = await getAllMenus();

        setMenus(data || []);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchRestaurants();
    fetchMenus();
  }, []);

  // Get unique categories from menu
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(menus.map((menu) => menu.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [menus]);

  // Filter menu according to selected category
  const filteredMenus = useMemo(() => {
    const filtered =
      selectedCategory === "All"
        ? menus
        : menus.filter((menu) => menu.category === selectedCategory);

    return filtered.slice(0, 5);
  }, [menus, selectedCategory]);

  return (
    <div className="min-h-screen bg-background font-body text-text-primary">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-primary-500">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-text-white/10" />
          <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-secondary-300/20" />

          <div className="relative grid items-center lg:grid-cols-2">
            {/* LEFT */}
            <div className="px-7 py-16 sm:px-12 lg:px-16 lg:py-24">
              <div className="inline-flex items-center gap-2 rounded-full bg-text-white/15 px-4 py-2 text-xs font-semibold text-text-white backdrop-blur">
                <span>🔥</span>
                Delicious food, delivered fast
              </div>

              <h1 className="mt-6 max-w-xl font-heading text-4xl font-extrabold leading-[1.08] text-text-white sm:text-5xl lg:text-6xl">
                Your cravings,
                <br />
                <span className="text-secondary-200">our delivery.</span>
              </h1>

              <p className="mt-6 max-w-lg text-sm leading-7 text-text-white/80 sm:text-base">
                Order delicious food from your favourite local restaurants and
                get it delivered straight to your doorstep.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/restaurants")}
                  className="rounded-xl bg-surface px-7 py-3.5 text-sm font-bold text-primary-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-primary-50"
                >
                  Order Now →
                </button>

                <button
                  onClick={() => navigate("/orders")}
                  className="rounded-xl border border-text-white/30 bg-text-white/10 px-7 py-3.5 text-sm font-semibold text-text-white backdrop-blur transition hover:bg-text-white/20"
                >
                  Track Orders
                </button>
              </div>

              {/* Small stats */}
              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <p className="font-heading text-xl font-bold text-text-white">
                    4.8★
                  </p>
                  <p className="text-xs text-text-white/60">Customer rating</p>
                </div>

                <div>
                  <p className="font-heading text-xl font-bold text-text-white">
                    Fast
                  </p>
                  <p className="text-xs text-text-white/60">Delivery</p>
                </div>

                <div>
                  <p className="font-heading text-xl font-bold text-text-white">
                    Fresh
                  </p>
                  <p className="text-xs text-text-white/60">Food</p>
                </div>
              </div>
            </div>

            {/* RIGHT FOOD VISUAL */}
            <div className="relative hidden min-h-130 lg:block">
              <div className="absolute left-16 top-24 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-3xl shadow-xl">
                🍟
              </div>

              <div className="absolute right-20 top-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-3xl shadow-xl">
                🍕
              </div>

              <div className="absolute bottom-24 left-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface text-3xl shadow-xl">
                🥤
              </div>

              {/* Main food card */}
              <div className="absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rotate-2 rounded-4xl bg-surface p-4 shadow-2xl">
                <div className="flex h-72 items-center justify-center rounded-3xl bg-secondary-100 text-[9rem]">
                  🍔
                </div>

                <div className="px-2 pb-2 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold">
                      Classic Burger
                    </h3>

                    <span className="font-heading font-bold text-primary-600">
                      ₹199
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                    <span>⭐ 4.8</span>
                    <span>•</span>
                    <span>25-30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* CATEGORIES */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500">
              What are you craving?
            </p>

            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Explore by category
            </h2>
          </div>
        </div>

        {menuLoading ? (
          <div className="mt-7 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-28 min-w-28 animate-pulse rounded-2xl bg-primary-100"
              />
            ))}
          </div>
        ) : categories.length <= 1 ? (
          <div className="mt-7 rounded-2xl border border-border bg-surface p-6 text-sm text-text-secondary">
            Categories will appear when menu items are available.
          </div>
        ) : (
          <div className="mt-7 flex gap-4 overflow-x-auto pb-3">
            {categories.map((category) => {
              const icon = categoryIcons[category] || categoryIcons.default;

              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group min-w-27.5 rounded-2xl border px-5 py-4 text-center transition ${
                    active
                      ? "border-primary-500 bg-primary-500 text-text-white shadow-lg"
                      : "border-border bg-surface text-text-primary hover:border-primary-200 hover:bg-primary-50"
                  }`}
                >
                  <div className="text-3xl transition group-hover:scale-110">
                    {category === "All" ? "🍽️" : icon}
                  </div>

                  <p
                    className={`mt-2 text-xs font-semibold ${
                      active ? "text-text-white" : "text-text-primary"
                    }`}
                  >
                    {category}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* POPULAR MENU */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-600">
              Fresh & tasty
            </p>

            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              {selectedCategory === "All"
                ? "Popular dishes"
                : `${selectedCategory} favourites`}
            </h2>
          </div>

          <button
            onClick={() => navigate("/menu")}
            className="hidden text-sm font-semibold text-primary-500 sm:block"
          >
            View all →
          </button>
        </div>

        {menuLoading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-primary-100"
              />
            ))}
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-border bg-surface p-12 text-center">
            <div className="text-5xl">🍽️</div>

            <h3 className="mt-4 font-heading text-lg font-bold">
              No dishes found
            </h3>

            <p className="mt-1 text-sm text-text-secondary">
              Try another category.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMenus.map((menu) => (
              <div
                key={menu._id}
                className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative h-44 overflow-hidden bg-secondary-100">
                  {menu.menuImage ? (
                    <img
                      src={menu.menuImage}
                      alt={menu.itemName}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-7xl">
                      {categoryIcons[menu.category] || "🍽️"}
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-bold text-primary-600 shadow">
                    {menu.category || "Food"}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="line-clamp-1 font-heading text-base font-bold">
                    {menu.itemName}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-text-secondary">
                    {menu.description || "Delicious food made fresh for you."}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-heading text-lg font-bold text-primary-600">
                      ₹{menu.price}
                    </span>

                    <button
                      onClick={() => navigate(`/menu/${menu._id}`)}
                      className="rounded-xl bg-primary-50 px-3 py-2 text-xs font-bold text-primary-600 transition hover:bg-primary-100"
                    >
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================================================= */}
      {/* RESTAURANTS */}
      {/* ================================================= */}

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500">
                Discover
              </p>

              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                Top restaurants
              </h2>

              <p className="mt-2 text-sm text-text-secondary">
                Delicious food from restaurants around you.
              </p>
            </div>

            <button
              onClick={() => navigate("/restaurants")}
              className="hidden text-sm font-semibold text-primary-500 sm:block"
            >
              View all →
            </button>
          </div>

          {restaurantLoading ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-3xl bg-primary-100"
                />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-border p-12 text-center">
              <span className="text-5xl">🏪</span>

              <p className="mt-4 text-sm text-text-secondary">
                No restaurants available right now.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {restaurants.slice(0, 4).map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="group overflow-hidden rounded-3xl border border-border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden bg-primary-100">
                    {restaurant.banner ? (
                      <img
                        src={getImageUrl(restaurant.banner)}
                        alt={restaurant.restaurantName}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        {restaurant.restaurantName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-surface/95 px-3 py-1 text-xs font-bold shadow">
                      ⭐ {restaurant.rating || "New"}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading text-lg font-bold">
                      {restaurant.restaurantName}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
                      {restaurant.description || "Delicious food awaits you."}
                    </p>

                    {restaurant.cuisine?.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {restaurant.cuisine.slice(0, 2).map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/restaurant/${restaurant.slug}`)}
                      className="mt-5 w-full rounded-xl bg-primary-500 py-2.5 text-sm font-bold text-text-white transition hover:bg-primary-600"
                    >
                      View Restaurant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================================================= */}
      {/* JOIN US */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* RESTAURANT */}
          <div className="relative overflow-hidden rounded-4xl bg-primary-500 p-8 sm:p-10">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-text-white/10" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl shadow">
                🏪
              </div>

              <h2 className="mt-6 font-heading text-3xl font-bold text-text-white">
                Own a restaurant?
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-text-white/80">
                Partner with us and take your restaurant online. Reach new
                customers and grow your business.
              </p>

              <button
                onClick={() => navigate("/restaurant-register")}
                className="mt-7 rounded-xl bg-surface px-6 py-3 text-sm font-bold text-primary-600 shadow transition hover:bg-primary-50"
              >
                Register Your Restaurant →
              </button>
            </div>
          </div>

          {/* DELIVERY */}
          <div className="relative overflow-hidden rounded-4xl bg-secondary-500 p-8 sm:p-10">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-text-white/10" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-2xl shadow">
                🛵
              </div>

              <h2 className="mt-6 font-heading text-3xl font-bold text-text-white">
                Become a delivery partner
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-text-white/80">
                Earn money on your schedule by delivering delicious food to
                customers.
              </p>

              <button
                onClick={() => navigate("/register-delivery")}
                className="mt-7 rounded-xl bg-surface px-6 py-3 text-sm font-bold text-secondary-700 shadow transition hover:bg-secondary-50"
              >
                Join as Partner →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* FOOTER CTA */}
      {/* ================================================= */}

      <section className="bg-primary-950 px-4 py-14 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-300">
          Hungry?
        </p>

        <h2 className="mt-3 font-heading text-3xl font-bold text-text-white sm:text-4xl">
          Let's get something delicious.
        </h2>

        <button
          onClick={() => navigate("/restaurants")}
          className="mt-6 rounded-xl bg-primary-500 px-7 py-3.5 text-sm font-bold text-text-white transition hover:bg-primary-600"
        >
          Start Ordering →
        </button>
      </section>
    </div>
  );
};

export default Home;
