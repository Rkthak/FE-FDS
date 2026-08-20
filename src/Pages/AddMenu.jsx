import { useState } from "react";
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import { createMenu } from "../Services/menuService";

const AddMenu = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    category: "",
    price: "",
    isVeg: true,
    isAvailable: true,

    nutrition: {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    },

    customizations: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [customization, setCustomization] = useState({
    name: "",
    extraPrice: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= BASIC INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= NUTRITION =================

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [name]: value,
      },
    }));
  };

  // ================= IMAGE =================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setError("");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ================= CUSTOMIZATION =================

  const handleCustomizationChange = (e) => {
    const { name, value } = e.target;

    setCustomization((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addCustomization = () => {
    if (!customization.name.trim()) {
      setError("Customization name is required.");
      return;
    }

    if (
      customization.extraPrice === "" ||
      Number(customization.extraPrice) < 0
    ) {
      setError("Customization price cannot be negative.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customizations: [
        ...prev.customizations,
        {
          name: customization.name.trim(),
          extraPrice: Number(customization.extraPrice),
        },
      ],
    }));

    setCustomization({
      name: "",
      extraPrice: "",
    });

    setError("");
  };

  const removeCustomization = (index) => {
    setFormData((prev) => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // Image required
      if (!imageFile) {
        setError("Dish image is required.");
        toast.error("Dish image is required.");
        setSaving(false);
        return;
      }

      // Basic validation
      if (!formData.itemName.trim()) {
        setError("Item name is required.");
        toast.error("Item name is required.");
        setSaving(false);
        return;
      }

      if (!formData.category.trim()) {
        setError("Category is required.");
        toast.error("Category is required.");
        setSaving(false);
        return;
      }

      if (!formData.price || Number(formData.price) <= 0) {
        setError("Price must be greater than 0.");
        toast.error("Price must be greater than 0.");
        setSaving(false);
        return;
      }

      // ================= FORM DATA =================

      const data = new FormData();

      data.append("menuImage", imageFile);

      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", Number(formData.price));

      data.append("isVeg", formData.isVeg);
      data.append("isAvailable", formData.isAvailable);

      data.append(
        "nutrition",
        JSON.stringify({
          calories:
            formData.nutrition.calories === ""
              ? undefined
              : Number(formData.nutrition.calories),

          protein:
            formData.nutrition.protein === ""
              ? undefined
              : Number(formData.nutrition.protein),

          carbs:
            formData.nutrition.carbs === ""
              ? undefined
              : Number(formData.nutrition.carbs),

          fat:
            formData.nutrition.fat === ""
              ? undefined
              : Number(formData.nutrition.fat),
        }),
      );

      data.append("customizations", JSON.stringify(formData.customizations));

      const response = await createMenu(data);

      toast.success(response?.message || "Menu created successfully!");

      navigate("/restaurant/dashboard/menu");
    } catch (error) {
      toast.error(error.response?.data?.message || "unable to create menu");
      setError(error.response?.data?.message || "Unable to create menu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
              >
                ←
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                  Add Menu Item
                </h1>

                <p className="text-xs sm:text-sm text-slate-500">
                  Add a new dish to your restaurant menu
                </p>
              </div>
            </div>

            <button
              type="submit"
              form="add-menu-form"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              {saving ? "Saving..." : "Save Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form id="add-menu-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ================= LEFT ================= */}

            <div className="lg:col-span-2 space-y-6">
              {/* BASIC INFORMATION */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Basic Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Enter information about your dish
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {/* ITEM NAME */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Item Name
                    </label>

                    <input
                      type="text"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleChange}
                      placeholder="e.g. Paneer Butter Masala"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your dish..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition resize-none"
                    />
                  </div>

                  {/* CATEGORY + PRICE */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Category
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g. Main Course"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        placeholder="₹200"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= NUTRITION ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Nutrition
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Optional nutritional information
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Calories
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="calories"
                        value={formData.nutrition.calories}
                        onChange={handleNutritionChange}
                        onWheel={(e) => e.target.blur()}
                        placeholder="250"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Protein (g)
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="protein"
                        value={formData.nutrition.protein}
                        onChange={handleNutritionChange}
                        onWheel={(e) => e.target.blur()}
                        placeholder="12"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Carbs (g)
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="carbs"
                        value={formData.nutrition.carbs}
                        onChange={handleNutritionChange}
                        onWheel={(e) => e.target.blur()}
                        placeholder="30"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Fat (g)
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="fat"
                        value={formData.nutrition.fat}
                        onChange={handleNutritionChange}
                        onWheel={(e) => e.target.blur()}
                        placeholder="8"
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= CUSTOMIZATIONS ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Customizations
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Add extras customers can choose
                  </p>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px_auto] gap-3">
                    <input
                      type="text"
                      name="name"
                      value={customization.name}
                      onChange={handleCustomizationChange}
                      placeholder="e.g. Extra Cheese"
                      className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                    />

                    <input
                      type="number"
                      min="0"
                      name="extraPrice"
                      value={customization.extraPrice}
                      onChange={handleCustomizationChange}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Extra ₹"
                      className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                    />

                    <button
                      type="button"
                      onClick={addCustomization}
                      className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm"
                    >
                      + Add
                    </button>
                  </div>

                  {/* CUSTOMIZATION LIST */}

                  {formData.customizations.length > 0 && (
                    <div className="mt-5 space-y-3">
                      {formData.customizations.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          <div>
                            <p className="font-semibold text-slate-700">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              + ₹{item.extraPrice}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCustomization(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ================= RIGHT ================= */}

            <div className="space-y-6">
              {/* IMAGE */}

              <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800">Dish Image</h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Upload a clear image of your dish
                  </p>
                </div>

                <div className="p-5">
                  <div className="w-full aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Dish preview"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/default-food.png";
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-5xl">🍽️</span>

                        <p className="text-xs text-slate-400 mt-2">
                          No image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <label className="block mt-4 cursor-pointer">
                    <div className="w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-sm py-3 rounded-xl transition">
                      📷 Choose Dish Image
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imageFile && (
                    <p className="text-xs text-slate-500 mt-3 text-center truncate">
                      {imageFile.name}
                    </p>
                  )}
                </div>
              </section>

              {/* ================= STATUS ================= */}

              <section className="bg-white border border-slate-200 rounded-2xl p-5">
                <h2 className="font-bold text-slate-800">Menu Settings</h2>

                {/* VEG */}

                <div className="flex items-center justify-between mt-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Vegetarian
                    </p>

                    <p className="text-xs text-slate-500">
                      Mark this dish as vegetarian
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isVeg: !prev.isVeg,
                      }))
                    }
                    className={`relative w-12 h-7 rounded-full transition ${
                      formData.isVeg ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
                        formData.isVeg ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* AVAILABLE */}

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Available
                    </p>

                    <p className="text-xs text-slate-500">
                      Customers can order this dish
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isAvailable: !prev.isAvailable,
                      }))
                    }
                    className={`relative w-12 h-7 rounded-full transition ${
                      formData.isAvailable ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
                        formData.isAvailable ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* ================= BOTTOM ================= */}

          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/restaurant/dashboard/menu")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold text-sm transition"
            >
              {saving ? "Creating..." : "Create Menu Item"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddMenu;
