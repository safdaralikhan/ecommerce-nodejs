import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // User ke multiple addresses rakhnay ke liye
    addresses: [
      {
        fullName: String,
        phone: String,
        city: String,
        state: String,
        postalCode: String,
        addressLine: String,
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
