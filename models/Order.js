import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  
     {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
         guestId: {
        type: String,
        required: false,
      },

    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number,
      }
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      city: String,
      state: String,
      postalCode: String,
      addressLine: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      default: "COD",
    },

   paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed", "refunded"],
  default: "pending",
},

orderStatus: {
  type: String,
  enum: ["order placed", "processing", "shipped", "delivered", "cancelled"],
  default: "order placed"
},

    totalAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
