import Stripe from "stripe";
import Order from "./Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ status: false, message: "Order items required" });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // -------------------- 1️⃣ CASH ON DELIVERY --------------------
    if (paymentMethod === "COD") {
      const order = await Order.create({
        userId,
        orderItems,
        shippingAddress,
        paymentMethod: "COD",
        paymentStatus: "pending",
        orderStatus: "processing",
        totalAmount,
      });

      return res.status(201).json({
        status: true,
        type: "COD",
        message: "Order placed successfully (Cash on Delivery)",
        data: order,
      });
    }

    // -------------------- 2️⃣ CARD (STRIPE CHECKOUT) --------------------
    if (paymentMethod === "CARD") {
      // Create pending order first
      const order = await Order.create({
        userId,
        orderItems,
        shippingAddress,
        paymentMethod: "CARD",
        paymentStatus: "pending",
        orderStatus: "processing",
        totalAmount,
      });

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel?orderId=${order._id}`,
        metadata: { orderId: order._id.toString() },

        line_items: orderItems.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productId.toString(),
            },
            unit_amount: item.price * 100,
          },
          quantity: item.qty,
        })),
      });

      return res.status(200).json({
        status: true,
        type: "CARD",
        message: "Stripe checkout session created",
        sessionUrl: session.url,
        orderId: order._id,
      });
    }

    return res.status(400).json({ status: false, message: "Invalid payment method" });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Order failed",
      error: error.message,
    });
  }
};








