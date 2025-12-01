
import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody, 
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // ---- Payment Success ----
    if (event.type === "checkout.session.completed") {
      const data = event.data.object;
      const orderId = data.metadata.orderId;

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "processing",
      });

      console.log("Order marked as PAID:", orderId);
    }

    res.status(200).json({ received: true });

  } catch (err) {
    console.log("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

