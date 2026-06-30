import mongoose from "mongoose";

const specificationSchema = new mongoose.Schema(
  {
    key: String,
    value: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Basic
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      default: "",
    },

    // Category
    category: String,
    subCategory: String,
    brand: String,

    // Price
    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    // Images
    image: String,

    images: {
      type: [String],
      default: [],
    },

    // Details
    description: String,

    watt: String,
    voltage: String,
    warranty: String,

    // Homepage
    featured: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    newArrival: {
      type: Boolean,
      default: true,
    },

    // SEO / Search
    tags: {
      type: [String],
      default: [],
    },

    specifications: {
      type: [specificationSchema],
      default: [],
    },

    rating: {
      type: Number,
      default: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);