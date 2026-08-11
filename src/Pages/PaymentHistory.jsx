import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMyPayments } from "../Services/payment";

const PaymentHistory = () => {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getMyPayments();

        setPayments(response.payments || []);
      } catch (error) {
        console.log(error);

        setError(
          error?.response?.data?.message || "Unable to load payment history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 font-body">
        <div className="mx-auto max-w-4xl">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-primary-100" />

          <div className="mt-8 space-y-4">
            <div className="h-36 animate-pulse rounded-2xl bg-surface shadow-sm" />
            <div className="h-36 animate-pulse rounded-2xl bg-surface shadow-sm" />
            <div className="h-36 animate-pulse rounded-2xl bg-surface shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 font-body">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-primary">
            Payment History
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            View all your previous payments
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-error/20 bg-red-50 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && payments.length === 0 && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
            <div className="text-5xl">💳</div>

            <h2 className="mt-4 font-heading text-xl font-bold text-text-primary">
              No payments yet
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Your payment history will appear here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-5 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-text-white transition hover:bg-primary-600"
            >
              Start Ordering
            </button>
          </div>
        )}

        {/* Payments */}
        <div className="mt-6 space-y-4">
          {payments.map((payment) => {
            const amount = payment.amount / 100;

            return (
              <div
                key={payment._id}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Payment Info */}
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-xl">
                        💳
                      </div>

                      <div>
                        <h2 className="font-heading text-xl font-bold text-text-primary">
                          ₹{amount}
                        </h2>

                        <p className="text-xs text-text-muted">
                          {new Date(payment.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Payment ID */}
                    <div className="mt-4">
                      <p className="text-xs text-text-muted">Payment ID</p>

                      <p className="mt-1 break-all text-sm font-medium text-text-secondary">
                        {payment.razorpayPaymentId || "Not available"}
                      </p>
                    </div>
                  </div>

                  {/* Status + Order */}
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        payment.status === "paid"
                          ? "bg-green-100 text-success"
                          : payment.status === "failed"
                            ? "bg-red-100 text-error"
                            : "bg-yellow-100 text-warning"
                      }`}
                    >
                      {payment.status.toUpperCase()}
                    </span>

                    {payment.orderId?._id && (
                      <button
                        onClick={() =>
                          navigate(`/order/${payment.orderId._id}`)
                        }
                        className="text-sm font-semibold text-primary-500 transition hover:text-primary-600"
                      >
                        View Order →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
