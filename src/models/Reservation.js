import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    quantity: {
      type: Number,
      default: 1,
    },

    status: {
      type: String,
      default: "pending",
    },
    stockReduced: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

export default mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);