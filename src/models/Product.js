import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    category: String,
    price: Number,
    stock: Number,
    watt: String,
    voltage: String,
    warranty: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);