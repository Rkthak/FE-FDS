import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  getMyRestaurantApplication,
  updateMyRestaurantApplication,
} from "../Services/restaurant";

const RestaurantReapply = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    cuisine: "",
    phoneNumber: "",

    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    open: "",
    close: "",

    deliveryTime: "",
    deliveryFee: "",
    minimumOrder: "",
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await getMyRestaurantApplication();
        const restaurant = response.restaurant;

        if (restaurant.status !== "rejected") {
          toast.info("Only rejected applications can be edited.");
          navigate("/profile");
          return;
        }

        setFormData({
          restaurantName: restaurant.restaurantName || "",
          description: restaurant.description || "",
          cuisine: restaurant.cuisine?.join(", ") || "",
          phoneNumber: restaurant.phoneNumber || "",

          street: restaurant.address?.street || "",
          city: restaurant.address?.city || "",
          state: restaurant.address?.state || "",
          pincode: restaurant.address?.pincode || "",
          country: restaurant.address?.country || "India",

          open: restaurant.openingHours?.open || "",
          close: restaurant.openingHours?.close || "",

          deliveryTime: restaurant.deliveryTime ?? "",
          deliveryFee: restaurant.deliveryFee ?? "",
          minimumOrder: restaurant.minimumOrder ?? "",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Unable to load restaurant application.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();

      data.append("restaurantName", formData.restaurantName);
      data.append("description", formData.description);

      const cuisines = formData.cuisine
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("cuisine", JSON.stringify(cuisines));

      data.append("phoneNumber", formData.phoneNumber);

      data.append(
        "address",
        JSON.stringify({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        }),
      );

      data.append(
        "openingHours",
        JSON.stringify({
          open: formData.open,
          close: formData.close,
        }),
      );

      data.append("deliveryTime", formData.deliveryTime);
      data.append("deliveryFee", formData.deliveryFee);
      data.append("minimumOrder", formData.minimumOrder);

      if (logo) {
        data.append("restaurantLogo", logo);
      }

      if (banner) {
        data.append("restaurantBanner", banner);
      }

      const response = await updateMyRestaurantApplication(data);

      toast.success(
        response.message || "Restaurant application resubmitted successfully.",
      );

      navigate("/profile");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Unable to resubmit application.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-text-secondary">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-heading text-sm font-semibold text-primary-500">
            Restaurant Application
          </p>

          <h1 className="mt-1 font-logo text-3xl font-black text-text-primary sm:text-4xl">
            Edit & Reapply
          </h1>

          <p className="mt-2 font-body text-sm text-text-secondary">
            Fix the issues mentioned by the admin and submit your restaurant
            application again.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8"
        >
          {/* Restaurant Information */}
          <section>
            <h2 className="font-logo text-xl font-black text-text-primary">
              Restaurant Information
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Restaurant Name
                </label>

                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Cuisine
                </label>

                <input
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  placeholder="Indian, Chinese, Italian"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />

                <p className="mt-1 text-xs text-text-muted">
                  Separate multiple cuisines with commas.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section>
            <h2 className="font-logo text-xl font-black text-text-primary">
              Restaurant Address
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Street
                </label>

                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>
          </section>

          {/* Opening Hours */}
          <section>
            <h2 className="font-logo text-xl font-black text-text-primary">
              Opening Hours
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Opening Time
                </label>

                <input
                  type="time"
                  name="open"
                  value={formData.open}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Closing Time
                </label>

                <input
                  type="time"
                  name="close"
                  value={formData.close}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="font-logo text-xl font-black text-text-primary">
              Delivery Details
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Delivery Time
                </label>

                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  min="10"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Delivery Fee
                </label>

                <input
                  type="number"
                  name="deliveryFee"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  min="0"
                  required
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Minimum Order
                </label>

                <input
                  type="number"
                  name="minimumOrder"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  min="0"
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text-primary outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section>
            <h2 className="font-logo text-xl font-black text-text-primary">
              Restaurant Images
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Upload new images only if you want to replace the existing ones.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Restaurant Logo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Restaurant Banner
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBanner(e.target.files?.[0] || null)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              disabled={saving}
              className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-background disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary-500 px-7 py-3 text-sm font-bold text-text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Resubmitting..." : "Submit Again"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantReapply;
