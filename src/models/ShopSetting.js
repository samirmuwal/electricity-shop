import mongoose from "mongoose";

const shopSettingSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      default: "Electric Shop",
    },
    phone: {
      type: String,
      default: "",
    },
    whatsapp: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ShopSetting ||
  mongoose.model("ShopSetting", shopSettingSchema);