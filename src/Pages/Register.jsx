import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "../Services/authService.js";
import { useNavigate } from "react-router";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (formData.userName.length < 3) {
      toast.error("User name must be at least 3 characters long");
      return;
    }

    try {
      const userData = {
        userName: formData.userName,
        email: formData.email.toLowerCase(),
        password: formData.password,
      };

      const response = await registerUser(userData);
      toast.success(response.message);

      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again...";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-surface shadow-2xl lg:flex">
        {/* ================= LEFT SECTION ================= */}
        <div className="relative overflow-hidden bg-primary-500 px-10 py-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-center">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-400/40" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-primary-600/40" />

          {/* Content */}
          <div className="relative z-10">
            <h1 className="font-logo text-5xl font-black tracking-tight text-text-white">
              Food<span className="text-secondary-200">Rush</span>
            </h1>

            <p className="mt-8 font-logo text-3xl font-bold leading-tight text-text-white lg:text-4xl">
              Good food,
              <br />
              good mood! 🍔
            </p>

            <p className="mt-4 max-w-md font-body text-base leading-7 text-primary-50">
              Create your account and discover delicious food from your
              favourite restaurants around you.
            </p>
          </div>

          {/* Food Illustration */}
          <div className="relative z-10 mt-12 flex justify-center">
            <div className="flex h-56 w-56 items-center justify-center rounded-full bg-secondary-500 shadow-2xl">
              <span className="text-8xl">🍕</span>
            </div>
          </div>

          {/* Feature */}
          <div className="relative z-10 mt-10">
            <div className="flex items-center gap-3 text-text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                🚀
              </div>

              <div>
                <p className="font-heading font-semibold">
                  Fast & easy ordering
                </p>

                <p className="font-body text-sm text-primary-50">
                  Your cravings are just a few clicks away.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="w-full px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 lg:py-12">
          {/* Back to Home */}
          <button
            type="button"
            className="float-right mb-3 flex items-center gap-2 font-body text-sm font-medium text-text-secondary transition hover:text-primary-500"
          >
            <span className="text-lg">←</span>
            Back to Home
          </button>

          <div className="mx-auto max-w-md">
            {/* Heading */}
            <p className="font-heading text-sm font-medium text-primary-500">
              Welcome to FoodRush 👋
            </p>

            <h2 className="mt-2 font-logo text-3xl font-bold text-text-primary">
              Create your account
            </h2>

            <p className="mt-2 font-body text-sm text-text-secondary">
              Join us and start ordering your favourite food.
            </p>

            {/* ================= FORM ================= */}
            <form className="mt-8 space-y-5" onSubmit={handleRegister}>
              {/* Name */}
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-text-primary">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userName: e.target.value,
                    })
                  }
                  value={formData.userName}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-text-primary">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  value={formData.email}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block font-body text-sm font-medium text-text-primary">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-20 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    value={formData.password}
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm font-medium text-primary-500 hover:text-primary-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-primary-500"
                />

                <p className="font-body text-sm text-text-secondary">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-primary-500 hover:text-primary-700"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and Privacy Policy.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-primary-500 py-3.5 font-heading font-bold text-text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-600 active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center font-body text-sm text-text-secondary">
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-primary-500 hover:text-primary-700"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
