import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getMenuByID } from "../Services/menuService";
import { setCart } from "../Redux/cartSlice";
import { addToCart } from "../Services/cartService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const MenuDetails = () => {
  const { menuID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenuByID(menuID);

        setMenu(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuID]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background">
        <div className="text-6xl">🍽️</div>

        <h2 className="mt-4 font-heading text-2xl font-bold">Menu not found</h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-text-white hover:bg-primary-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  // ADD TO CART
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
    <div className="min-h-screen bg-background font-body">
      {/* Back */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-text-secondary transition hover:text-primary-500"
        >
          ← Back
        </button>
      </div>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-4xl border border-border bg-surface shadow-sm lg:grid-cols-2">
          {/* IMAGE */}
          <div className="min-h-87.5 bg-secondary-100 lg:min-h-125">
            {menu.menuImage && (
              <img
                src={menu.menuImage}
                alt={menu.itemName}
                onError={(e) => {
                  e.currentTarget.hidden = true;
                }}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            {/* Category */}
            {menu.category && (
              <span className="w-fit rounded-full bg-primary-50 px-4 py-2 text-xs font-bold text-primary-600">
                {menu.category}
              </span>
            )}

            {/* Name */}
            <h1 className="mt-5 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
              {menu.itemName}
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-xl text-sm leading-7 text-text-secondary">
              {menu.description || "Delicious food prepared fresh for you."}
            </p>

            {/* Price */}
            <div className="mt-7 flex items-center gap-4">
              <span className="font-heading text-3xl font-bold text-primary-600">
                ₹{menu.price}
              </span>

              {menu.isAvailable !== false && (
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  Available
                </span>
              )}
            </div>

            {/* Restaurant */}
            {menu.restaurantId && (
              <button
                onClick={() =>
                  navigate(
                    `/restaurant/${menu.restaurantId.slug || menu.restaurantId.slugID}`,
                  )
                }
                className="mt-8 w-fit text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                View Restaurant →
              </button>
            )}

            {/* Add to cart */}
            <button
              className="mt-8 w-full rounded-xl bg-primary-500 py-3.5 text-sm font-bold text-text-white transition hover:bg-primary-600 sm:w-64"
              onClick={() => handleAddToCart(menu._id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MenuDetails;
