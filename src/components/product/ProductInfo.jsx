export default function ProductInfo({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
        {product.category || "Product"}
      </span>

      <h1 className="text-3xl font-bold mt-4">
        {product.name}
      </h1>

      <p className="text-gray-500 mt-2">
        Brand: <span className="font-semibold">{product.brand || "N/A"}</span>
      </p>

      <div className="flex items-center gap-3 mt-5">

        {product.salePrice > 0 ? (
          <>
            <span className="text-3xl font-bold text-orange-600">
              ₹{product.salePrice}
            </span>

            <span className="text-xl text-gray-400 line-through">
              ₹{product.price}
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold">
            ₹{product.price}
          </span>
        )}

      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">

        <div className="border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Stock</p>
          <p className="font-semibold">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Warranty</p>
          <p className="font-semibold">
            {product.warranty || "N/A"}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Voltage</p>
          <p className="font-semibold">
            {product.voltage || "N/A"}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Watt</p>
          <p className="font-semibold">
            {product.watt || "N/A"}
          </p>
        </div>

      </div>

      <div className="mt-8">
        <h2 className="font-bold text-lg mb-3">
          Description
        </h2>

        <p className="text-gray-600 leading-7">
          {product.description || "No description available."}
        </p>
      </div>

    </div>
  );
}