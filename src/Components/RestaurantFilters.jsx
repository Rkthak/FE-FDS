import { useState } from "react";
import { searchRestaurants } from "../Services/restaurant";

const RestaurantFilters = ({ setRestaurants }) => {
  const [location, setLocation] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ratings, setRatings] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const filters = {
        location,
        cuisine,
        ratings,
        minPrice,
        maxPrice,
      };

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      );

      const response = await searchRestaurants(cleanFilters);

      setRestaurants(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log("Filter error:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setLocation("");
    setCuisine("");
    setRatings("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="mb-8 rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        {/* Location */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 City"
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary-500"
        />

        {/* Cuisine */}
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary-500"
        >
          <option value="">🍽️ All Cuisines</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="Italian">Italian</option>
          <option value="Fast Food">Fast Food</option>
          <option value="South Indian">South Indian</option>
        </select>

        {/* Rating */}
        <select
          value={ratings}
          onChange={(e) => setRatings(e.target.value)}
          className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary-500"
        >
          <option value="">⭐ Any Rating</option>
          <option value="4">4+ ⭐</option>
          <option value="3">3+ ⭐</option>
          <option value="2">2+ ⭐</option>
        </select>

        {/* Price */}
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="₹ Min"
            className="w-1/2 rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary-500"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="₹ Max"
            className="w-1/2 rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary-500"
          />
        </div>

        {/* Search */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-text-white transition hover:bg-primary-600 disabled:opacity-60"
        >
          {loading ? "Searching..." : "🔍 Search"}
        </button>
      </div>

      <button
        onClick={handleClear}
        className="mt-3 text-xs font-semibold text-text-secondary hover:text-primary-500"
      >
        Clear filters
      </button>
    </div>
  );
};

export default RestaurantFilters;
