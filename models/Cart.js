import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,  // image ka URL ya path
      required: true,
    },
  },
  { timestamps: true }
);

// ⚡ Conditional export to prevent OverwriteModelError
export default mongoose.models.Category || mongoose.model("Category", categorySchema);
