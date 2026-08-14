import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { applyRestaurant } from "../Services/restaurant";

const RestaurantRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    cuisine: "",
    phoneNumber: "",
    deliveryTime: "",
    deliveryFee: "",
    minimumOrder: "",

    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },

    openingHours: {
      open: "",
      close: "",
    },
  });

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));

      return;
    }

    if (name.startsWith("openingHours.")) {
      const field = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        openingHours: {
          ...prev.openingHours,
          [field]: value,
        },
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cuisine.trim()) {
      toast.error("Please enter at least one cuisine.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("restaurantName", formData.restaurantName.trim());

      data.append("description", formData.description.trim());

      // Convert comma separated cuisine into array
      const cuisineArray = formData.cuisine
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      data.append("cuisine", JSON.stringify(cuisineArray));

      data.append("phoneNumber", formData.phoneNumber.trim());

      data.append("deliveryTime", formData.deliveryTime);

      data.append("deliveryFee", formData.deliveryFee);

      data.append("minimumOrder", formData.minimumOrder);

      data.append("address", JSON.stringify(formData.address));

      data.append("openingHours", JSON.stringify(formData.openingHours));

      if (logo) {
        data.append("restaurantLogo", logo);
      }

      if (banner) {
        data.append("restaurantBanner", banner);
      }

      const response = await applyRestaurant(data);

      toast.success(
        response.message || "Restaurant application submitted successfully.",
      );

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.response?.message ||
          "Unable to submit restaurant application.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* ================= HEADER ================= */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-slate-500 hover:text-slate-800 mb-4"
          >
            ← Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Register Your Restaurant
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Submit your restaurant details for admin approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= BASIC INFORMATION ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Restaurant Name"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Enter restaurant name"
                required
              />

              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cuisine
                </label>

                <input
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  placeholder="Indian, Chinese, Fast Food"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Separate multiple cuisines with commas.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell customers about your restaurant..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Maximum 1000 characters.
                </p>
              </div>
            </div>
          </section>

          {/* ================= ADDRESS ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              Restaurant Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="House number, street, area"
                  required
                />
              </div>

              <Input
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />

              <Input
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />

              <Input
                label="Pincode"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
              />

              <Input
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* ================= DELIVERY ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              Delivery Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Input
                label="Delivery Time (minutes)"
                name="deliveryTime"
                type="number"
                min="10"
                value={formData.deliveryTime}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="30"
                required
              />

              <Input
                label="Delivery Fee"
                name="deliveryFee"
                type="number"
                min="0"
                step="0.01"
                value={formData.deliveryFee}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="40"
                required
              />

              <Input
                label="Minimum Order"
                name="minimumOrder"
                type="number"
                min="0"
                step="0.01"
                value={formData.minimumOrder}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="100"
              />
            </div>
          </section>

          {/* ================= OPENING HOURS ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              Opening Hours
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Opening Time
                </label>

                <input
                  type="time"
                  name="openingHours.open"
                  value={formData.openingHours.open}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Closing Time
                </label>

                <input
                  type="time"
                  name="openingHours.close"
                  value={formData.openingHours.close}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <p className="text-xs text-text-secondary">
                add in 24hrs time format
              </p>
            </div>
          </section>

          {/* ================= IMAGES ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              Restaurant Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileInput
                label="Restaurant Logo"
                file={logo}
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />

              <FileInput
                label="Restaurant Banner"
                file={banner}
                onChange={(e) => setBanner(e.target.files?.[0] || null)}
              />
            </div>
          </section>

          {/* ================= SUBMIT ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">Submit Application</h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your restaurant will remain pending until an admin reviews it.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

// ================= INPUT COMPONENT =================

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  step,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  );
};

// ================= FILE INPUT =================

const FileInput = ({ label, file, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <label className="min-h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition">
        <div className="text-4xl mb-3">🖼️</div>

        <p className="text-sm font-semibold text-slate-700 text-center">
          {file ? file.name : `Upload ${label}`}
        </p>

        <p className="text-xs text-slate-400 mt-2">PNG, JPG or WEBP</p>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default RestaurantRegister;
