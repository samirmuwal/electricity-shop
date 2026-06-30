"use client";

export default function FiltersSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  stockFilter,
  setStockFilter,
}) {
  return (
    <aside className="bg-white rounded-2xl shadow p-5 sticky top-24 h-fit">

      <h2 className="text-xl font-bold mb-5">
        Filters
      </h2>

      {/* Category */}

      <div className="mb-8">

        <h3 className="font-semibold mb-3">
          Categories
        </h3>

        <div className="space-y-2">

          {categories.map((cat) => (

            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>

          ))}

        </div>

      </div>

      {/* Stock */}

      <div>

        <h3 className="font-semibold mb-3">
          Stock
        </h3>

        <select
          value={stockFilter}
          onChange={(e)=>setStockFilter(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="All">
            All
          </option>

          <option value="in-stock">
            In Stock
          </option>

          <option value="out-of-stock">
            Out of Stock
          </option>

        </select>

      </div>

    </aside>
  );
}