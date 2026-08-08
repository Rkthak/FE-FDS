import { useState } from "react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-surface rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="lg:w-1/2 bg-primary-500 relative overflow-hidden px-8 py-12 lg:px-14 lg:py-16 flex flex-col justify-between">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-400/40" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-primary-700/30" />

          <div className=" z-10">
            <h1 className="text-5xl font-black text-text-white tracking-tight font-logo">
              Food<span className="text-secondary-200">Rush</span>
            </h1>

            <p className="mt-8 text-3xl lg:text-4xl font-bold text-text-white leading-tight font-logo">
              Good food,
              <br />
              good mood! 🍔
            </p>

            <p className="mt-4 max-w-md text-primary-50 text-base leading-7 font-body">
              Create your account and discover delicious food from your
              favourite restaurants around you.
            </p>
          </div>

          {/* Food Illustration */}
          <div className="relative z-10 flex justify-center mt-12">
            <div className="w-56 h-56 rounded-full bg-secondary-500 flex items-center justify-center shadow-2xl">
              <span className="text-8xl">🍕</span>
            </div>
          </div>

          <div className="relative z-10 mt-10">
            <div className="flex items-center gap-3 text-text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🚀
              </div>

              <div>
                <p className="font-semibold font-heading">
                  Fast & easy ordering
                </p>

                <p className="text-sm text-primary-50 font-body">
                  Your cravings are just a few clicks away.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
          <button
            type="button"
            onClick={() => alert("hello")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary-500 transition font-body float-right"
          >
            <span className="text-lg">←</span>
            Back to Home
          </button>
          <div className="max-w-md mx-auto">
            <p className="text-sm font-medium text-primary-500 font-heading">
              Welcome to FoodRush 👋
            </p>

            <h2 className="mt-2 text-3xl font-bold text-text-primary font-logo">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-text-secondary font-body">
              Join us and start ordering your favourite food.
            </p>

            <form className="mt-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="font-logo font-semi  bold w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-muted outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="font-logo font-semi  bold w-full px-4 py-3 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-muted outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2 font-body">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="font-logo font-semi  bold w-full px-4 py-3 pr-20 rounded-xl border border-border bg-background text-text-primary placeholder:text-text-muted outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-500 hover:text-primary-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 accent-primary-500" />

                <p className="text-sm text-text-secondary font-body">
                  I agree to font-logo font-semi bold the{" "}
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
                className="w-full py-3.5 rounded-xl bg-primary-500 text-text-white font-bold shadow-lg shadow-primary-500/20 transition hover:bg-primary-600 active:scale-[0.98] font-heading"
              >
                Create Account
              </button>
            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-text-secondary font-body">
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
