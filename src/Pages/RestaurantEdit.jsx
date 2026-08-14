import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  deleteMyRestaurant,
  getMyRestaurantById,
  updateMyRestaurant,
  uploadRestaurantBanner,
  uploadRestaurantLogo,
} from "../Services/restaurant";
import { getImageUrl } from "../Services/helper";
import { toast } from "react-toastify";

const RestaurantEdit = () => {
  const { slugID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: "",
    description: "",
    phoneNumber: "",
    cuisine: [],
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    openingHours: "",
    deliveryTime: "",
    deliveryFee: "",
    minimumOrder: "",
    isOpen: true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH RESTAURANT =================

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyRestaurantById(slugID);

        setFormData({
          restaurantName: response.restaurantName || "",
          description: response.description || "",
          phoneNumber: response.phoneNumber || "",

          cuisine: Array.isArray(response.cuisine) ? response.cuisine : [],

          address: {
            street: response.address?.street || "",
            city: response.address?.city || "",
            state: response.address?.state || "",
            pincode: response.address?.pincode || "",
            country: response.address?.country || "",
          },

          openingHours: response.openingHours || "",
          deliveryTime: response.deliveryTime || "",
          deliveryFee: response.deliveryFee ?? "",
          minimumOrder: response.minimumOrder ?? "",
          isOpen: response.isOpen ?? true,
        });

        // Existing images
        setLogoPreview(getImageUrl(response.logo) || "");
        setBannerPreview(getImageUrl(response.banner) || "");
      } catch (error) {
        toast.error(error.response?.data?.message);

        setError(error.response?.data?.message || "Unable to load restaurant.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [slugID]);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============ HANDLE ADDRESS CHANGE ==========
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // ================= LOGO =================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      toast.info("Please select a valid image.");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  // ================= BANNER =================

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      toast.info("Please select a valid image.");
      return;
    }

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await updateMyRestaurant(slugID, formData);

      toast.success("Restaurant updated successfully!");

      navigate("/restaurant/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message);

      setError(error.response?.data?.message || "Unable to update restaurant.");
    } finally {
      setSaving(false);
    }
  };

  // ================ LOGO UPLOADING ===========
  const handleLogoUpload = async () => {
    if (!logoFile) {
      setError("Please select a logo first.");
      return;
    }

    try {
      setUploadingLogo(true);
      setError("");

      const response = await uploadRestaurantLogo(slugID, logoFile);

      setLogoPreview(getImageUrl(response.logo));

      setLogoFile(null);

      toast.success(response.message || "Logo uploaded successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message);

      setError(error.response?.data?.message || "Unable to upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  // ============== BANNER UPLOAD ==================
  const handleBannerUpload = async () => {
    if (!bannerFile) {
      setError("Please select a banner first.");
      return;
    }

    try {
      setUploadingBanner(true);
      setError("");

      const response = await uploadRestaurantBanner(slugID, bannerFile);

      setBannerPreview(getImageUrl(response.banner));

      setBannerFile(null);

      toast.success(response.message || "Banner uploaded successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message);

      setError(error.response?.data?.message || "Unable to upload banner.");
    } finally {
      setUploadingBanner(false);
    }
  };

  // =================== DELETE RESTAURANT =============
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRestaurant = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this restaurant? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteMyRestaurant(slugID);

      toast.success("Restaurant deleted successfully.");

      navigate("/restaurant/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message);

      setError(error.response?.data?.message || "Unable to delete restaurant.");
    } finally {
      setDeleting(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading restaurant...</p>
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
                onClick={() => navigate("/restaurant/dashboard")}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition shrink-0"
              >
                ←
              </button>

              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                  Edit Restaurant
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  Update your restaurant information
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              {saving ? "Saving..." : "Save Changes"}
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* ================================================= */}
            {/* LEFT SIDE */}
            {/* ================================================= */}

            <div className="xl:col-span-2 space-y-6">
              {/* ================= BASIC INFORMATION ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Basic Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Basic information about your restaurant
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Restaurant Name */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Restaurant Name
                    </label>

                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      placeholder="Enter restaurant name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </div>

                  {/* Description */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Tell customers about your restaurant..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition resize-none"
                    />
                  </div>

                  {/* Phone + Cuisine */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cuisine
                      </label>

                      <input
                        type="text"
                        name="cuisine"
                        value={formData.cuisine.join(", ")}
                        onChange={(e) => {
                          const cuisineArray = e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean);

                          setFormData((prev) => ({
                            ...prev,
                            cuisine: cuisineArray,
                          }));
                        }}
                        placeholder="Indian, Chinese, Italian"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                      <p className="px-2 text-xs text-text-secondary">
                        values should be comma ( ,) saparated
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= ADDRESS ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Restaurant Address
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Where customers can find your restaurant
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* Street */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Street / Address
                    </label>

                    <textarea
                      name="street"
                      value={formData.address.street}
                      onChange={handleAddressChange}
                      rows="3"
                      placeholder="Enter street or nearby location"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition resize-none"
                    />
                  </div>

                  {/* City + State */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                  </div>

                  {/* Pincode + Country */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={formData.address.pincode}
                        onChange={handleAddressChange}
                        placeholder="Pincode"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Country
                      </label>

                      <input
                        type="text"
                        name="country"
                        value={formData.address.country}
                        onChange={handleAddressChange}
                        placeholder="Country"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= DELIVERY ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Delivery Settings
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Configure your restaurant delivery information
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Delivery Time */}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Delivery Time
                      </label>

                      <input
                        type="text"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleChange}
                        placeholder="30-40 min"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>

                    {/* Delivery Fee */}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Delivery Fee
                      </label>

                      <input
                        type="number"
                        name="deliveryFee"
                        value={formData.deliveryFee}
                        onChange={handleChange}
                        placeholder="₹40"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>

                    {/* Minimum Order */}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Minimum Order
                      </label>

                      <input
                        type="number"
                        name="minimumOrder"
                        value={formData.minimumOrder}
                        onChange={handleChange}
                        placeholder="₹200"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ================================================= */}
            {/* RIGHT SIDE */}
            {/* ================================================= */}

            <div className="space-y-6">
              {/* ================= LOGO ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800">Restaurant Logo</h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Recommended: 500 × 500 px
                  </p>
                </div>

                <div className="p-5">
                  <div className="w-36 h-36 mx-auto rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Restaurant logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl">🏪</span>

                        <p className="text-xs text-slate-400 mt-2">No logo</p>
                      </div>
                    )}
                  </div>

                  <label className="block mt-4 cursor-pointer">
                    <div className="w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm py-3 rounded-xl transition">
                      📷 Choose Logo
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>

                  {logoFile && (
                    <p className="text-xs text-slate-500 mt-3 text-center truncate">
                      {logoFile.name}
                    </p>
                  )}
                  {logoFile && (
                    <button
                      type="button"
                      onClick={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold text-sm py-3 rounded-xl transition"
                    >
                      {uploadingLogo ? "Uploading..." : "Upload Logo"}
                    </button>
                  )}
                </div>
              </section>

              {/* ================= BANNER ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800">
                    Restaurant Banner
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Recommended: 1200 × 400 px
                  </p>
                </div>

                <div className="p-5">
                  <div className="w-full aspect-3/1 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Restaurant banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl">🖼️</span>

                        <p className="text-xs text-slate-400 mt-2">No banner</p>
                      </div>
                    )}
                  </div>

                  <label className="block mt-4 cursor-pointer">
                    <div className="w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm py-3 rounded-xl transition">
                      📷 Choose Banner
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                  </label>

                  {bannerFile && (
                    <p className="text-xs text-slate-500 mt-3 text-center truncate">
                      {bannerFile.name}
                    </p>
                  )}
                  {bannerFile && (
                    <button
                      type="button"
                      onClick={handleBannerUpload}
                      disabled={uploadingBanner}
                      className="w-full mt-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold text-sm py-3 rounded-xl transition"
                    >
                      {uploadingBanner ? "Uploading..." : "Upload Banner"}
                    </button>
                  )}
                </div>
              </section>

              {/* ================= RESTAURANT STATUS ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Restaurant Status
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Customers can see this status
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isOpen: !prev.isOpen,
                      }))
                    }
                    className={`relative w-12 h-7 rounded-full transition ${
                      formData.isOpen ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
                        formData.isOpen ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
                      formData.isOpen
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.isOpen ? "bg-green-500" : "bg-red-500"
                      }`}
                    />

                    {formData.isOpen ? "Currently Open" : "Currently Closed"}
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* ================= BOTTOM ACTIONS ================= */}

          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/restaurant/dashboard")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold text-sm transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* DANGER ZONE ----- DELETE RESTAURANT */}
        <section className="bg-white border border-red-200 rounded-2xl overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-red-200">
            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>

            <p className="text-sm text-slate-500 mt-1">
              These actions can affect your restaurant account permanently.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <button
              type="button"
              onClick={handleDeleteRestaurant}
              disabled={deleting}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold"
            >
              {deleting ? "Deleting..." : "Delete Restaurant"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RestaurantEdit;
