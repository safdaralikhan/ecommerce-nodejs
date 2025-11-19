import Order from "../models/Order.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// -------------------- PLACE ORDER (COD) --------------------
export const placeOrder = async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ status: false, message: "Order items are required" });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);

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
        message: "Order placed successfully (COD)",
        data: order,
      });
    }

    // Agar paymentMethod CARD hai → frontend PaymentIntent handle karega
    if (paymentMethod === "CARD") {
      const order = await Order.create({
        userId,
        orderItems,
        shippingAddress,
        paymentMethod: "CARD",
        paymentStatus: "pending",
        orderStatus: "processing",
        totalAmount,
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // cents
        currency: "usd",
        metadata: { orderId: order._id.toString() },
      });

      return res.status(200).json({
        status: true,
        message: "Stripe payment initiated",
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
      });
    }

    return res.status(400).json({ status: false, message: "Invalid payment method" });

  } catch (error) {
    return res.status(500).json({ status: false, message: "Order failed", error: error.message });
  }
};

// -------------------- CREATE PAYMENT INTENT (CARD) --------------------
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) return res.status(400).json({ status: false, message: "Order ID is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });

    if (order.paymentMethod !== "CARD")
      return res.status(400).json({ status: false, message: "Payment method is not CARD" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount * 100,
      currency: "usd",
      metadata: { orderId: order._id.toString() },
    });

    res.status(200).json({
      status: true,
      message: "PaymentIntent created",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Failed to create payment intent", error: error.message });
  }
};

// -------------------- CONFIRM PAYMENT (AFTER FRONTEND COMPLETES STRIPE PAYMENT) --------------------
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    if (!orderId || !paymentIntentId)
      return res.status(400).json({ status: false, message: "Order ID and PaymentIntent ID required" });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ status: false, message: "Order not found" });

      order.paymentStatus = "paid";
      await order.save();

      return res.status(200).json({
        status: true,
        message: "Payment confirmed and order updated",
        data: order,
      });
    }

    res.status(400).json({ status: false, message: "Payment not completed" });
  } catch (error) {
    res.status(500).json({ status: false, message: "Payment confirmation failed", error: error.message });
  }
};




export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("orderItems.productId", "name images price")
      .sort({ createdAt: -1 });

    return res.json({
      status: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

// admin all orders

export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // user details
      .populate("orderItems.productId", "name images price") // product details
      .sort({ createdAt: -1 });

    return res.json({
      status: true,
      totalOrders: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching all orders",
      error: error.message
    });
  }
};

export const adminGetOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("orderItems.productId", "name images price brand");

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found"
      });
    }

    return res.json({
      status: true,
      data: order
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching order",
      error: error.message
    });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatus = [
      "processing",
      "on-the-way",
      "shipped",
      "delivered",
      "cancelled"
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      status: true,
      message: "Order status updated",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

export const adminUpdatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const valid = ["pending", "paid", "failed", "refunded"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = status;
    await order.save();

    res.json({
      status: true,
      message: "Payment status updated",
      data: order,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error updating payment status",
      error: error.message,
    });
  }
};



