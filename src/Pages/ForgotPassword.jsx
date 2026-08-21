import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { sendResetPasswordOTP, resetPassword } from "../Services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendResetPasswordOTP(email);

      toast.success(response.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset OTP. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword(
        email,
        otp,
        newPassword,
        confirmPassword,
      );

      toast.success(response.message);

      navigate("/login");
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError(
          "OTP may have been sent. Please check your email before requesting a new OTP.",
        );
        return;
      }
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while resetting your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-8">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          {otpSent
            ? "Enter the OTP sent to your email and create a new password."
            : "Enter your registered email to receive a password reset OTP."}
        </p>

        {!otpSent ? (
          // ================= EMAIL =================
          <form onSubmit={handleSendOTP} className="mt-6 space-y-5">
            <p>{error}</p>
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={!email && loading}
              className="w-full rounded-xl bg-primary-500 py-3 font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // ================= OTP + PASSWORD =================
          <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-border bg-gray-100 px-4 py-3 text-text-secondary"
              />
            </div>

            {/* OTP */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 tracking-[6px] outline-none transition focus:border-primary-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-text-primary">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-500 py-3 font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            {/* Change Email */}
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="w-full text-sm font-semibold text-primary-500 hover:text-primary-600"
            >
              Change Email
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-6 block text-center text-sm text-text-secondary hover:text-primary-500"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
