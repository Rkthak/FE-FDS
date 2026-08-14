import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { deleteMenu, getMyMenu } from "../Services/menuService";
import { getImageUrl } from "../Services/helper";

const RestaurantMenu = () => {
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  // ================= GET MY MENU =================

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyMenu();

        setMenus(response.menus || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Unable to load menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // ================= DELETE MENU =================

  const handleDelete = async (menuID) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?",
    );

    if (!confirmed) return;

    try {
      setDeleting(menuID);

      await deleteMenu(menuID);

      setMenus((prev) => prev.filter((menu) => menu._id !== menuID));

      toast.success("Menu item deleted successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Unable to delete menu item.",
      );
    } finally {
      setDeleting(null);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* LEFT */}

            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => navigate("/restaurant/dashboard")}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0"
              >
                ←
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                  Restaurant Menu
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Manage your restaurant menu
                </p>
              </div>
            </div>

            {/* ADD BUTTON */}

            <button
              type="button"
              onClick={() => navigate("/restaurant/dashboard/menu/create")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              + Add Menu
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ================= TOP INFO ================= */}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Your Menu</h2>

          <p className="text-sm text-slate-500 mt-1">
            {menus.length} {menus.length === 1 ? "menu item" : "menu items"}
          </p>
        </div>

        {/* ================= EMPTY STATE ================= */}

        {menus.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800">
              No menu items yet
            </h2>

            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              Start adding dishes to your restaurant menu so customers can
              discover and order them.
            </p>

            <button
              type="button"
              onClick={() => navigate("/restaurant/menu/create")}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
            >
              + Add Your First Menu
            </button>
          </div>
        ) : (
          /* ================= MENU GRID ================= */

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div
                key={menu._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition"
              >
                {/* IMAGE */}

                <div className="relative h-52 bg-slate-100">
                  {menu.image ? (
                    <img
                      src={getImageUrl(menu.image)}
                      alt={menu.itemName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-food.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">🍽️</span>
                    </div>
                  )}

                  {/* VEG */}

                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        menu.isVeg
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          menu.isVeg ? "bg-green-500" : "bg-red-500"
                        }`}
                      />

                      {menu.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                    </span>
                  </div>

                  {/* AVAILABLE */}

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        menu.isAvailable
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {menu.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg text-slate-800 truncate">
                        {menu.itemName}
                      </h3>

                      <p className="text-xs text-orange-600 font-semibold mt-1">
                        {menu.category}
                      </p>
                    </div>

                    <p className="text-lg font-bold text-slate-800 shrink-0">
                      ₹{menu.price}
                    </p>
                  </div>

                  {/* DESCRIPTION */}

                  {menu.description && (
                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                      {menu.description}
                    </p>
                  )}

                  {/* NUTRITION */}

                  {menu.nutrition &&
                    (menu.nutrition.calories ||
                      menu.nutrition.protein ||
                      menu.nutrition.carbs ||
                      menu.nutrition.fat) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {menu.nutrition.calories && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                            {menu.nutrition.calories} kcal
                          </span>
                        )}

                        {menu.nutrition.protein && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                            P: {menu.nutrition.protein}g
                          </span>
                        )}

                        {menu.nutrition.carbs && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                            C: {menu.nutrition.carbs}g
                          </span>
                        )}

                        {menu.nutrition.fat && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                            F: {menu.nutrition.fat}g
                          </span>
                        )}
                      </div>
                    )}

                  {/* ACTIONS */}

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/restaurant/dashboard/menu/${menu._id}/edit`)
                      }
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(menu._id)}
                      disabled={deleting === menu._id}
                      className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 disabled:bg-red-100 text-red-600 text-sm font-semibold transition"
                    >
                      {deleting === menu._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantMenu;
