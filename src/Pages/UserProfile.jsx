import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProfile,
  updateProfile,
  updateProfilePicture,
} from "../Services/authService";
import { clearUser, setUser } from "../Redux/authSlice";
import { toast } from "react-toastify";
import { getImageUrl } from "../Services/helper";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    fullAddress: user?.addresses?.fullAddress || "",
    city: user?.addresses?.city || "",
    state: user?.addresses?.state || "",
    pincode: user?.addresses?.pincode || "",
    landmark: user?.addresses?.landmark || "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(
    user?.profileImage ? getImageUrl(user?.profileImage) : "",
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const userData = {
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,

        addresses: {
          fullAddress: formData.fullAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
      };

      const profileResponse = await updateProfile(userData);

      let updatedUser = profileResponse.user;

      // 2️⃣ Profile image upload
      if (selectedImage) {
        const imageResponse = await updateProfilePicture(selectedImage);

        updatedUser = imageResponse.user;
      }

      // 3️⃣ Redux update
      dispatch(setUser(updatedUser));

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const navigate = useNavigate();

  const [deleting, setDeleting] = useState(false);

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const response = await deleteProfile();

      // Redux se user remove
      dispatch(clearUser());

      toast.success(response.message || "Account deleted successfully");

      // Login page par bhejo
      navigate("/register");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <p className="font-heading text-sm font-semibold text-primary-500">
            Account Settings
          </p>

          <h1 className="mt-1 font-logo text-3xl font-black text-text-primary sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 font-body text-sm text-text-secondary">
            Manage your personal information and account details.
          </p>
        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
          {/* Top Banner */}
          <div className="h-32 bg-linear-to-r from-primary-500 to-secondary-500 sm:h-40" />

          <div className="px-5 pb-8 sm:px-8">
            {/* ================= PROFILE IMAGE ================= */}
            <div className="-mt-16 flex flex-col items-start gap-4 sm:-mt-20 sm:flex-row sm:items-end">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-primary-100 shadow-lg sm:h-40 sm:w-40">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-black text-primary-500 sm:text-6xl">
                      {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                {/* Upload Button */}
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-surface bg-primary-500 text-lg text-text-white shadow-md transition hover:bg-primary-600"
                >
                  📷
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* User Name */}
              <div className="pb-2">
                <h2 className="font-logo text-2xl font-black text-text-primary">
                  {user?.userName.toUpperCase() || "User"}
                </h2>

                <p className="mt-1 font-body text-sm text-text-secondary">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* ================= ACCOUNT STATUS ================= */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {/* Role */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="font-body text-xs font-medium text-text-muted">
                  Account Role
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg">👤</span>

                  <p className="font-heading text-sm font-bold capitalize text-text-primary">
                    {user?.role || "user"}
                  </p>
                </div>
              </div>

              {/* Verification */}
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="font-body text-xs font-medium text-text-muted">
                  Verification Status
                </p>

                <div className="mt-2 flex items-center gap-2">
                  {user?.isVerified ? (
                    <>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10 text-sm text-success">
                        ✓
                      </span>

                      <p className="font-heading text-sm font-bold text-success">
                        Verified
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10 text-sm text-warning">
                        !
                      </span>

                      <p className="font-heading text-sm font-bold text-warning">
                        Not Verified
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ================= FORM ================= */}
            <form onSubmit={handleSubmit} className="mt-8">
              {/* Personal Information */}
              <div>
                <h3 className="font-logo text-xl font-black text-text-primary">
                  Personal Information
                </h3>

                <p className="mt-1 font-body text-sm text-text-secondary">
                  Update your personal details.
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* Username */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                    Username
                  </label>

                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>

                {/* Role - Read Only */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                    Role
                  </label>

                  <input
                    type="text"
                    value={user?.role || "user"}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-border bg-gray-100 px-4 py-3 font-body capitalize text-text-secondary outline-none"
                  />
                </div>
              </div>

              {/* ================= ADDRESS ================= */}
              <div className="mt-10">
                <h3 className="font-logo text-xl font-black text-text-primary">
                  Delivery Address
                </h3>

                <p className="mt-1 font-body text-sm text-text-secondary">
                  Add your default delivery address.
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {/* Full Address */}
                <div>
                  <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                    Full Address
                  </label>

                  <textarea
                    name="fullAddress"
                    value={formData.fullAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House no, street, area..."
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>

                {/* City / State / Pincode */}
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-semibold text-text-primary">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-body text-sm font-medium text-text-primary">
                      Landmark
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Near City Mall"
                      value={formData.landmark}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          landmark: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 font-body text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* ================= SAVE ================= */}
              <div className="mt-8 flex justify-end border-t border-border pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary-500 px-7 py-3 font-heading font-bold text-text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* PAYMENTS SECTION */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Payment History
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                View your previous payments and transactions.
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-xl">
              💳
            </div>
          </div>

          <button
            onClick={() => navigate("/payment-history")}
            className="mt-4 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-text-white transition hover:bg-primary-600"
          >
            View Payment History →
          </button>
        </div>

        {/*DELETE PROFILE  */}
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-heading text-lg font-bold text-red-600">
            Danger Zone
          </h3>

          <p className="mt-2 font-body text-sm text-red-500">
            Deleting your account is permanent. All your account data will be
            removed.
          </p>

          <button
            type="button"
            onClick={handleDeleteProfile}
            disabled={deleting}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 font-body text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
