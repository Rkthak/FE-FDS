import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { getMyMenuById, updateMenu } from "../Services/menuService";
import { getImageUrl } from "../Services/helper";

const EditMenu = () => {
  const { menuID } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  // ================= FETCH MENU =================

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyMenuById(menuID);

        setFormData({
          itemName: response.itemName || "",
          description: response.description || "",
          category: response.category || "",
          price: response.price ?? "",
          isVeg: response.isVeg ?? true,
          isAvailable: response.isAvailable ?? true,

          nutrition: {
            calories: response.nutrition?.calories ?? "",
            protein: response.nutrition?.protein ?? "",
            carbs: response.nutrition?.carbs ?? "",
            fat: response.nutrition?.fat ?? "",
          },

          customizations: Array.isArray(response.customizations)
            ? response.customizations
            : [],
        });

        setImagePreview(getImageUrl(response.image) || "");
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Unable to load menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuID]);

  // ================= INPUT CHANGE =================

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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  // ================= CUSTOMIZATION =================

  const addCustomization = () => {
    setFormData((prev) => ({
      ...prev,

      customizations: [
        ...prev.customizations,
        {
          name: "",
          extraPrice: 0,
        },
      ],
    }));
  };

  const removeCustomization = (index) => {
    setFormData((prev) => ({
      ...prev,

      customizations: prev.customizations.filter((_, i) => i !== index),
    }));
  };

  const handleCustomizationChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.customizations];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        customizations: updated,
      };
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = new FormData();

      data.append("itemName", formData.itemName);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
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

      data.append(
        "customizations",
        JSON.stringify(
          formData.customizations.map((item) => ({
            name: item.name,
            extraPrice: Number(item.extraPrice) || 0,
          })),
        ),
      );

      if (imageFile) {
        data.append("menuImage", imageFile);
      }

      await updateMenu(menuID, data);

      toast.success("Menu updated successfully!");

      navigate("/restaurant/dashboard/menu");
    } catch (error) {
      toast.error(error);

      setError(error.response?.data?.message || "Unable to update menu.");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-slate-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/restaurant/dashboard/menu")}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              >
                ←
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800">
                  Edit Menu
                </h1>

                <p className="text-xs sm:text-sm text-slate-500">
                  Update your menu item
                </p>
              </div>
            </div>

            <button
              type="submit"
              form="edit-menu-form"
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form id="edit-menu-form" onSubmit={handleSubmit} className="space-y-6">
          {/* ================= BASIC INFO ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                Basic Information
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Update basic information about your dish
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
                  placeholder="Pizza, Burger, Biryani..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
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
                    placeholder="Pizza, Burger, Main Course..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onWheel={(e) => e.currentTarget.blur()}
                    min="0"
                    placeholder="₹200"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* VEG */}

              <div className="flex items-center justify-between border border-slate-200 rounded-xl p-4">
                <div>
                  <p className="font-semibold text-slate-700">Vegetarian</p>

                  <p className="text-xs text-slate-500 mt-1">
                    Is this dish vegetarian?
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
                  className={`relative w-12 h-7 rounded-full ${
                    formData.isVeg ? "bg-green-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow ${
                      formData.isVeg ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* ================= IMAGE ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Dish Image</h2>

              <p className="text-sm text-slate-500 mt-1">
                Upload a new image if you want to change it
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="max-w-md mx-auto">
                <div className="aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={formData.itemName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <label className="block mt-4 cursor-pointer">
                  <div className="w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold py-3 rounded-xl">
                    📷 Choose New Image
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {imageFile && (
                  <p className="text-xs text-slate-500 text-center mt-3 truncate">
                    {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ================= NUTRITION ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">Nutrition</h2>

              <p className="text-sm text-slate-500 mt-1">
                Optional nutritional information
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  ["calories", "Calories"],
                  ["protein", "Protein (g)"],
                  ["carbs", "Carbs (g)"],
                  ["fat", "Fat (g)"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {label}
                    </label>

                    <input
                      type="number"
                      name={name}
                      value={formData.nutrition[name]}
                      onChange={handleNutritionChange}
                      onWheel={(e) => e.currentTarget.blur()}
                      min="0"
                      placeholder="0"
                      className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= CUSTOMIZATIONS ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Customizations
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add extra options for customers
                </p>
              </div>

              <button
                type="button"
                onClick={addCustomization}
                className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold"
              >
                + Add
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {formData.customizations.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">
                  No customizations added.
                </p>
              )}

              {formData.customizations.map((customization, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Name
                    </label>

                    <input
                      type="text"
                      value={customization.name}
                      onChange={(e) =>
                        handleCustomizationChange(index, "name", e.target.value)
                      }
                      placeholder="Extra cheese"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Extra Price
                    </label>

                    <input
                      type="number"
                      value={customization.extraPrice}
                      onChange={(e) =>
                        handleCustomizationChange(
                          index,
                          "extraPrice",
                          e.target.value,
                        )
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                      min="0"
                      placeholder="₹20"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCustomization(index)}
                    className="h-12 px-4 rounded-xl bg-red-50 text-red-600 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ================= AVAILABILITY ================= */}

          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-800">Menu Availability</h2>

                <p className="text-sm text-slate-500 mt-1">
                  Customers can see this item when available
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
                className={`relative w-12 h-7 rounded-full ${
                  formData.isAvailable ? "bg-green-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow ${
                    formData.isAvailable ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
                  formData.isAvailable
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    formData.isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                />

                {formData.isAvailable ? "Available" : "Not Available"}
              </span>
            </div>
          </section>

          {/* ================= ACTIONS ================= */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate("/restaurant/dashboard/menu")}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditMenu;
