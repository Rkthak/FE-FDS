import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { clearUser } from "../Redux/authSlice";
import { logoutUser } from "../Services/authService";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const cartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const displayCartCount = cartCount > 9 ? "9+" : cartCount;

  const handleLogout = async () => {
    try {
      await logoutUser();

      dispatch(clearUser());
      toast.success("Logged out successfully");

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again...";

      toast.error(errorMessage);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* ================= LOGO ================= */}
        <Link to="/" className="shrink-0">
          <h1 className="font-logo text-3xl font-black tracking-tight text-primary-500">
            Food<span className="text-secondary-500">Rush</span>
          </h1>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-body text-sm font-semibold text-text-primary transition hover:text-primary-500"
          >
            Home
          </Link>

          <Link
            to="/restaurants"
            className="font-body text-sm font-semibold text-text-primary transition hover:text-primary-500"
          >
            Restaurants
          </Link>

          {user ? (
            <>
              <Link
                to="/favorites"
                className="font-body text-sm font-semibold text-text-primary transition hover:text-primary-500"
              >
                Favorites
              </Link>
              <Link
                to="/orders"
                className="font-body text-sm font-semibold text-text-primary transition hover:text-primary-500"
              >
                My Orders
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/about"
                className="font-body text-sm font-semibold text-text-primary transition hover:text-primary-500"
              >
                About us
              </Link>
              <Link
                to="/restaurant-register"
                className="font-body text-sm font-semibold text-text-primary transition hover:text-primary-500"
              >
                Register Your Restaurant
              </Link>
            </>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-lg transition hover:border-primary-500 hover:text-primary-500 sm:flex"
          >
            🔍
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-lg transition hover:border-primary-500 hover:text-primary-500"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-2.5 -top-3 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-500 px-1.5 text-xs font-bold text-white">
                {displayCartCount}
              </span>
            )}
          </button>

          {/* ================= AUTH ================= */}
          {isAuthenticated ? (
            /* ================= USER DROPDOWN ================= */
            <div className="group relative">
              {/* User Button */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 transition hover:border-primary-500 hover:bg-primary-50"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 font-bold text-text-white">
                  {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* User Name */}
                <div className="hidden text-left sm:block">
                  <p className="text-xs text-text-muted">Welcome</p>

                  <p className="max-w-24 truncate font-body text-sm font-bold text-text-primary">
                    {user?.userName || "User"}
                  </p>
                </div>

                {/* Arrow */}
                <span className="hidden text-xs text-text-secondary transition group-hover:rotate-180 sm:block">
                  ▼
                </span>
              </button>

              {/* ================= DROPDOWN ================= */}
              <div
                className="
                  invisible absolute right-0 top-full z-50 mt-2
                  w-56 translate-y-2 rounded-2xl
                  border border-border bg-surface p-2
                  opacity-0 shadow-xl
                  transition-all duration-200
                  group-hover:visible
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                {/* User Info */}
                <div className="border-b border-border px-3 py-3">
                  <p className="font-body text-sm font-bold text-text-primary">
                    {user?.userName || "User"}
                  </p>

                  <p className="mt-1 truncate font-body text-xs text-text-muted">
                    {user?.email}
                  </p>
                </div>

                {/* dashboard */}
                <Link
                  to={
                    user.role === "user"
                      ? "/dashboard"
                      : `${user.role}/dashboard`
                  }
                  className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-text-primary transition hover:bg-primary-50 hover:text-primary-500"
                >
                  <span className="text-lg">👤</span>
                  DashBoard
                </Link>
                {/* Edit Profile */}
                <Link
                  to="/profile"
                  className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-text-primary transition hover:bg-primary-50 hover:text-primary-500"
                >
                  <span className="text-lg">👤</span>
                  My Profile
                </Link>

                {/* My Orders */}
                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-text-primary transition hover:bg-primary-50 hover:text-primary-500"
                >
                  <span className="text-lg">📦</span>
                  My Orders
                </Link>

                {/* Favorites */}
                <Link
                  to="/favorites"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium text-text-primary transition hover:bg-primary-50 hover:text-primary-500"
                >
                  <span className="text-lg">❤️</span>
                  Favorites
                </Link>

                {/* Divider */}
                <div className="my-2 border-t border-border" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-semibold text-error transition hover:bg-error/10"
                >
                  <span className="text-lg">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            /* ================= GUEST ================= */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 font-body text-sm font-bold text-text-primary transition hover:bg-primary-50 hover:text-primary-500"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-primary-500 px-4 py-2 font-body text-sm font-bold text-text-white shadow-md shadow-primary-500/20 transition hover:bg-primary-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE NAV ================= */}
      <div className="border-t border-border md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-around px-3 py-3">
          <Link
            to="/"
            className="text-xs font-semibold text-text-secondary hover:text-primary-500"
          >
            🏠
            <span className="ml-1">Home</span>
          </Link>

          <Link
            to="/restaurants"
            className="text-xs font-semibold text-text-secondary hover:text-primary-500"
          >
            🍽️
            <span className="ml-1">Restaurants</span>
          </Link>

          <Link
            to="/favorites"
            className="text-xs font-semibold text-text-secondary hover:text-primary-500"
          >
            ❤️
            <span className="ml-1">Favorites</span>
          </Link>

          <Link
            to="/orders"
            className="text-xs font-semibold text-text-secondary hover:text-primary-500"
          >
            📦
            <span className="ml-1">Orders</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
