// import { useState } from "react";
// import { useNavigate } from "react-router";
// import { toast } from "react-toastify";

// import { applyRestaurant } from "../Services/restaurant";

// const RestaurantRegister = () => {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     restaurantName: "",
//     description: "",
//     cuisine: "",
//     phoneNumber: "",
//     deliveryTime: "",
//     deliveryFee: "",
//     minimumOrder: "",

//     address: {
//       street: "",
//       city: "",
//       state: "",
//       pincode: "",
//       country: "India",
//     },

//     openingHours: {
//       open: "",
//       close: "",
//     },
//   });

//   const [logo, setLogo] = useState(null);
//   const [banner, setBanner] = useState(null);

//   // ================= INPUT CHANGE =================

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("address.")) {
//       const field = name.split(".")[1];

//       setFormData((prev) => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [field]: value,
//         },
//       }));

//       return;
//     }

//     if (name.startsWith("openingHours.")) {
//       const field = name.split(".")[1];

//       setFormData((prev) => ({
//         ...prev,
//         openingHours: {
//           ...prev.openingHours,
//           [field]: value,
//         },
//       }));

//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ================= SUBMIT =================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.cuisine.trim()) {
//       toast.error("Please enter at least one cuisine.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = new FormData();

//       data.append("restaurantName", formData.restaurantName.trim());

//       data.append("description", formData.description.trim());

//       // Convert comma separated cuisine into array
//       const cuisineArray = formData.cuisine
//         .split(",")
//         .map((item) => item.trim())
//         .filter(Boolean);

//       data.append("cuisine", JSON.stringify(cuisineArray));

//       data.append("phoneNumber", formData.phoneNumber.trim());

//       data.append("deliveryTime", formData.deliveryTime);

//       data.append("deliveryFee", formData.deliveryFee);

//       data.append("minimumOrder", formData.minimumOrder);

//       data.append("address", JSON.stringify(formData.address));

//       data.append("openingHours", JSON.stringify(formData.openingHours));

//       if (logo) {
//         data.append("restaurantLogo", logo);
//       }

//       if (banner) {
//         data.append("restaurantBanner", banner);
//       }

//       const response = await applyRestaurant(data);

//       toast.success(
//         response.message || "Restaurant application submitted successfully.",
//       );

//       navigate("/");
//     } catch (error) {
//       console.log(error);

//       toast.error(
//         error.response?.data?.message ||
//           error.response?.message ||
//           "Unable to submit restaurant application.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-8">
//       <div className="max-w-5xl mx-auto">
//         {/* ================= HEADER ================= */}

//         <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="text-sm text-slate-500 hover:text-slate-800 mb-4"
//           >
//             ← Back
//           </button>

//           <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
//             Register Your Restaurant
//           </h1>

//           <p className="text-sm text-slate-500 mt-2">
//             Submit your restaurant details for admin approval.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* ================= BASIC INFORMATION ================= */}

//           <section className="bg-white border border-slate-200 rounded-2xl p-6">
//             <h2 className="text-lg font-bold text-slate-800 mb-5">
//               Basic Information
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <Input
//                 label="Restaurant Name"
//                 name="restaurantName"
//                 value={formData.restaurantName}
//                 onChange={handleChange}
//                 placeholder="Enter restaurant name"
//                 required
//               />

//               <Input
//                 label="Phone Number"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="Enter phone number"
//                 required
//               />

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Cuisine
//                 </label>

//                 <input
//                   type="text"
//                   name="cuisine"
//                   value={formData.cuisine}
//                   onChange={handleChange}
//                   placeholder="Indian, Chinese, Fast Food"
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />

//                 <p className="text-xs text-slate-400 mt-1">
//                   Separate multiple cuisines with commas.
//                 </p>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Description
//                 </label>

//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows={4}
//                   maxLength={1000}
//                   placeholder="Tell customers about your restaurant..."
//                   className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
//                 />

//                 <p className="text-xs text-slate-400 mt-1">
//                   Maximum 1000 characters.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* ================= ADDRESS ================= */}

//           <section className="bg-white border border-slate-200 rounded-2xl p-6">
//             <h2 className="text-lg font-bold text-slate-800 mb-5">
//               Restaurant Address
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div className="md:col-span-2">
//                 <Input
//                   label="Street"
//                   name="address.street"
//                   value={formData.address.street}
//                   onChange={handleChange}
//                   placeholder="House number, street, area"
//                   required
//                 />
//               </div>

//               <Input
//                 label="City"
//                 name="address.city"
//                 value={formData.address.city}
//                 onChange={handleChange}
//                 placeholder="Enter city"
//                 required
//               />

//               <Input
//                 label="State"
//                 name="address.state"
//                 value={formData.address.state}
//                 onChange={handleChange}
//                 placeholder="Enter state"
//                 required
//               />

//               <Input
//                 label="Pincode"
//                 name="address.pincode"
//                 value={formData.address.pincode}
//                 onChange={handleChange}
//                 placeholder="Enter pincode"
//                 required
//               />

//               <Input
//                 label="Country"
//                 name="address.country"
//                 value={formData.address.country}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </section>

//           {/* ================= DELIVERY ================= */}

//           <section className="bg-white border border-slate-200 rounded-2xl p-6">
//             <h2 className="text-lg font-bold text-slate-800 mb-5">
//               Delivery Details
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               <Input
//                 label="Delivery Time (minutes)"
//                 name="deliveryTime"
//                 type="number"
//                 min="10"
//                 value={formData.deliveryTime}
//                 onChange={handleChange}
//                 onWheel={(e) => e.currentTarget.blur()}
//                 placeholder="30"
//                 required
//               />

//               <Input
//                 label="Delivery Fee"
//                 name="deliveryFee"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.deliveryFee}
//                 onChange={handleChange}
//                 onWheel={(e) => e.currentTarget.blur()}
//                 placeholder="40"
//                 required
//               />

//               <Input
//                 label="Minimum Order"
//                 name="minimumOrder"
//                 type="number"
//                 min="0"
//                 step="0.01"
//                 value={formData.minimumOrder}
//                 onChange={handleChange}
//                 onWheel={(e) => e.currentTarget.blur()}
//                 placeholder="100"
//               />
//             </div>
//           </section>

//           {/* ================= OPENING HOURS ================= */}

//           <section className="bg-white border border-slate-200 rounded-2xl p-6">
//             <h2 className="text-lg font-bold text-slate-800 mb-5">
//               Opening Hours
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Opening Time
//                 </label>

//                 <input
//                   type="time"
//                   name="openingHours.open"
//                   value={formData.openingHours.open}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Closing Time
//                 </label>

//                 <input
//                   type="time"
//                   name="openingHours.close"
//                   value={formData.openingHours.close}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//                 />
//               </div>
//               <p className="text-xs text-text-secondary">
//                 add in 24hrs time format
//               </p>
//             </div>
//           </section>

//           {/* ================= IMAGES ================= */}

//           <section className="bg-white border border-slate-200 rounded-2xl p-6">
//             <h2 className="text-lg font-bold text-slate-800 mb-5">
//               Restaurant Images
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <FileInput
//                 label="Restaurant Logo"
//                 file={logo}
//                 onChange={(e) => setLogo(e.target.files?.[0] || null)}
//               />

//               <FileInput
//                 label="Restaurant Banner"
//                 file={banner}
//                 onChange={(e) => setBanner(e.target.files?.[0] || null)}
//               />
//             </div>
//           </section>

//           {/* ================= SUBMIT ================= */}

//           <section className="bg-white border border-slate-200 rounded-2xl p-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div>
//                 <h3 className="font-bold text-slate-800">Submit Application</h3>

//                 <p className="text-sm text-slate-500 mt-1">
//                   Your restaurant will remain pending until an admin reviews it.
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full sm:w-auto px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 {loading ? "Submitting..." : "Submit Application"}
//               </button>
//             </div>
//           </section>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ================= INPUT COMPONENT =================

// const Input = ({
//   label,
//   name,
//   type = "text",
//   value,
//   onChange,
//   placeholder = "",
//   required = false,
//   min,
//   step,
// }) => {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-slate-700 mb-2">
//         {label}
//       </label>

//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         min={min}
//         step={step}
//         className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
//       />
//     </div>
//   );
// };

// // ================= FILE INPUT =================

// const FileInput = ({ label, file, onChange }) => {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-slate-700 mb-2">
//         {label}
//       </label>

//       <label className="min-h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition">
//         <div className="text-4xl mb-3">🖼️</div>

//         <p className="text-sm font-semibold text-slate-700 text-center">
//           {file ? file.name : `Upload ${label}`}
//         </p>

//         <p className="text-xs text-slate-400 mt-2">PNG, JPG or WEBP</p>

//         <input
//           type="file"
//           accept="image/png,image/jpeg,image/webp"
//           onChange={onChange}
//           className="hidden"
//         />
//       </label>
//     </div>
//   );
// };

// export default RestaurantRegister;

import { useState } from "react";
import { useNavigate } from "react-router";

import { applyRestaurant } from "../Services/restaurant";
import { toast } from "react-toastify";

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

    if (name === "phoneNumber") {
      const phone = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        phoneNumber: phone,
      }));

      return;
    }

    if (name === "address.pincode") {
      const pincode = value.replace(/\D/g, "").slice(0, 6);

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          pincode,
        },
      }));

      return;
    }

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

    // ================= BASIC INFORMATION =================

    const restaurantName = formData.restaurantName.trim();
    const description = formData.description.trim();
    const cuisine = formData.cuisine.trim();
    const phoneNumber = formData.phoneNumber.trim();

    // Restaurant Name
    if (!restaurantName) {
      toast.error("Please enter your restaurant name.");
      return;
    }

    if (restaurantName.length < 3) {
      toast.error("Restaurant name must be at least 3 characters long.");
      return;
    }

    if (restaurantName.length > 100) {
      toast.error("Restaurant name cannot exceed 100 characters.");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please enter your phone number.");
      return;
    }

    // Cuisine
    if (!cuisine) {
      toast.error("Please enter at least one cuisine.");
      return;
    }

    const cuisineArray = cuisine
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (cuisineArray.length === 0) {
      toast.error("Please enter a valid cuisine.");
      return;
    }

    if (cuisineArray.some((item) => item.length < 2)) {
      toast.error("Each cuisine must contain at least 2 characters.");
      return;
    }

    if (cuisineArray.some((item) => item.length > 50)) {
      toast.error("Each cuisine cannot exceed 50 characters.");
      return;
    }

    // Description
    if (!description) {
      toast.error("Please enter a restaurant description.");
      return;
    }

    if (description.length < 20) {
      toast.error("Description must be at least 20 characters long.");
      return;
    }

    if (description.length > 1000) {
      toast.error("Description cannot exceed 1000 characters.");
      return;
    }

    // ================= ADDRESS =================

    const street = formData.address.street.trim();
    const city = formData.address.city.trim();
    const state = formData.address.state.trim();
    const pincode = formData.address.pincode.trim();
    const country = formData.address.country.trim();

    // Street
    if (!street) {
      toast.error("Please enter the restaurant street address.");
      return;
    }

    if (street.length < 5) {
      toast.error("Street address must be at least 5 characters long.");
      return;
    }

    if (street.length > 200) {
      toast.error("Street address cannot exceed 200 characters.");
      return;
    }

    // City
    if (!city) {
      toast.error("Please enter the city.");
      return;
    }

    if (city.length < 2) {
      toast.error("Please enter a valid city.");
      return;
    }

    if (city.length > 50) {
      toast.error("City name cannot exceed 50 characters.");
      return;
    }

    // State
    if (!state) {
      toast.error("Please enter the state.");
      return;
    }

    if (state.length < 2) {
      toast.error("Please enter a valid state.");
      return;
    }

    if (state.length > 50) {
      toast.error("State name cannot exceed 50 characters.");
      return;
    }

    if (!pincode) {
      toast.error("Please enter the pincode.");
      return;
    }

    // Country
    if (!country) {
      toast.error("Please enter the country.");
      return;
    }

    if (country.length < 2) {
      toast.error("Please enter a valid country.");
      return;
    }

    // ================= DELIVERY =================

    const deliveryTime = Number(formData.deliveryTime);
    const deliveryFee = Number(formData.deliveryFee);
    const minimumOrder = Number(formData.minimumOrder);

    // Delivery Time
    if (formData.deliveryTime === "") {
      toast.error("Please enter the delivery time.");
      return;
    }

    if (!Number.isFinite(deliveryTime)) {
      toast.error("Please enter a valid delivery time.");
      return;
    }

    if (!Number.isInteger(deliveryTime)) {
      toast.error("Delivery time must be a whole number.");
      return;
    }

    if (deliveryTime < 10) {
      toast.error("Delivery time must be at least 10 minutes.");
      return;
    }

    if (deliveryTime > 180) {
      toast.error("Delivery time cannot exceed 180 minutes.");
      return;
    }

    // Delivery Fee
    if (formData.deliveryFee === "") {
      toast.error("Please enter the delivery fee.");
      return;
    }

    if (!Number.isFinite(deliveryFee)) {
      toast.error("Please enter a valid delivery fee.");
      return;
    }

    if (deliveryFee < 0) {
      toast.error("Delivery fee cannot be negative.");
      return;
    }

    if (deliveryFee > 10000) {
      toast.error("Delivery fee cannot exceed ₹10,000.");
      return;
    }

    // Maximum 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(formData.deliveryFee)) {
      toast.error("Delivery fee can have maximum 2 decimal places.");
      return;
    }

    // Minimum Order
    if (formData.minimumOrder === "") {
      toast.error("Please enter the minimum order amount.");
      return;
    }

    if (!Number.isFinite(minimumOrder)) {
      toast.error("Please enter a valid minimum order amount.");
      return;
    }

    if (minimumOrder < 0) {
      toast.error("Minimum order amount cannot be negative.");
      return;
    }

    if (minimumOrder > 100000) {
      toast.error("Minimum order amount cannot exceed ₹1,00,000.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(formData.minimumOrder)) {
      toast.error("Minimum order can have maximum 2 decimal places.");
      return;
    }

    // ================= OPENING HOURS =================

    const { open, close } = formData.openingHours;

    if (!open) {
      toast.error("Please select opening time.");
      return;
    }

    if (!close) {
      toast.error("Please select closing time.");
      return;
    }

    if (open === close) {
      toast.error("Opening and closing time cannot be the same.");
      return;
    }

    // ================= IMAGE VALIDATION =================

    const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];

    const maxImageSize = 5 * 1024 * 1024;

    if (logo) {
      if (!allowedImageTypes.includes(logo.type)) {
        toast.error("Restaurant logo must be PNG, JPG or WEBP.");
        return;
      }

      if (logo.size > maxImageSize) {
        toast.error("Restaurant logo must be smaller than 5 MB.");
        return;
      }
    }

    if (banner) {
      if (!allowedImageTypes.includes(banner.type)) {
        toast.error("Restaurant banner must be PNG, JPG or WEBP.");
        return;
      }

      if (banner.size > maxImageSize) {
        toast.error("Restaurant banner must be smaller than 5 MB.");
        return;
      }
    }

    // ================= SUBMIT =================

    try {
      setLoading(true);

      const data = new FormData();

      data.append("restaurantName", restaurantName);
      data.append("description", description);
      data.append("cuisine", JSON.stringify(cuisineArray));
      data.append("phoneNumber", phoneNumber);

      data.append("deliveryTime", deliveryTime);
      data.append("deliveryFee", deliveryFee);
      data.append("minimumOrder", minimumOrder);

      data.append(
        "address",
        JSON.stringify({
          street,
          city,
          state,
          pincode,
          country,
        }),
      );

      data.append(
        "openingHours",
        JSON.stringify({
          open,
          close,
        }),
      );

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
            onClick={() => navigate("/")}
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

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                maxLength={100}
              />

              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                required
                numbersOnly
                maxLength={10}
                inputMode="numeric"
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
                  maxLength={200}
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
                  maxLength={200}
                />
              </div>

              <Input
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
                maxLength={50}
              />

              <Input
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
                maxLength={50}
              />

              <Input
                label="Pincode"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                placeholder="Enter 6-digit pincode"
                required
                numbersOnly
                maxLength={6}
                inputMode="numeric"
              />

              <Input
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
                maxLength={50}
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
                max="180"
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
                max="10000"
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
                max="100000"
                step="0.01"
                value={formData.minimumOrder}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="100"
                required
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

              <p className="text-xs text-slate-400">
                Add time in 24-hour format.
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
  max,
  maxLength,
  step,
  inputMode,
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
        max={max}
        maxLength={maxLength}
        step={step}
        inputMode={inputMode}
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
