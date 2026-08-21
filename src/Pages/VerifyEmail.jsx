import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  sendVerificationOTP,
  verifyVerificationOTP,
} from "../Services/authService";
import { setUser } from "../Redux/authSlice";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");

  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const [otpSent, setOtpSent] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isVerified) {
    return <Navigate to="/" replace />;
  }

  // ================= SEND OTP =================
  const handleSendOTP = async () => {
    try {
      setSendingOTP(true);
      setError("");
      setMessage("");

      const data = await sendVerificationOTP();

      setOtpSent(true);
      setMessage(data.message);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError(
          "OTP may have been sent. Please check your email before requesting a new OTP.",
        );
        return;
      }

      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOTP(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      setError("Please send OTP first.");
      toast.error("Please send OTP first.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6 digit OTP.");
      toast.error("Please enter a valid 6 digit OTP.");
      return;
    }

    try {
      setVerifyingOTP(true);
      setError("");
      setMessage("");

      const data = await verifyVerificationOTP(otp);

      setMessage(data.message);
      toast.success(data.message);

      // Update Redux user
      if (data.user) {
        dispatch(setUser(data.user));
      }

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyingOTP(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-text-primary">
          Verify Your Email
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          Verify your email address using the OTP sent to your email.
        </p>

        {/* SEND OTP */}
        <button
          type="button"
          onClick={handleSendOTP}
          disabled={sendingOTP || verifyingOTP}
          className="mt-6 w-full rounded-xl bg-primary-500 px-4 py-3 font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sendingOTP ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
        </button>

        {/* OTP FORM */}
        <form onSubmit={handleVerifyOTP} className="mt-5">
          <input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);

              setOtp(value);
              setError("");
            }}
            placeholder="Enter 6 digit OTP"
            maxLength={6}
            disabled={!otpSent || verifyingOTP}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg tracking-[8px] text-text-primary outline-none focus:border-primary-500"
          />

          <button
            type="submit"
            disabled={
              !otpSent || otp.length !== 6 || verifyingOTP || sendingOTP
            }
            className="mt-4 w-full rounded-xl bg-primary-500 px-4 py-3 font-semibold text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifyingOTP ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* MESSAGE */}
        {message && (
          <p className="mt-4 text-center text-sm text-success">{message}</p>
        )}

        {/* ERROR */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
