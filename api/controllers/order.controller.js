import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

// export const createOrder = async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.gigId);

//     const newOrder = new Order({
//       gigId: gig._id,
//       img: gig.cover,
//       title: gig.title,
//       buyerId: req.userId,
//       sellerId: gig.userId,
//       price: gig.price,
//       payment_intent: "temp",
//     });

//     await newOrder.save();

//     res.status(200).send("Order successfully made!");
//   } catch (error) {
//     next(error);
//   }
// };

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true || false,
    });

    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
};

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const gig = await Gig.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const confirm = async (req, res, next) => {
  try {
    // Check if paymentIntent is provided in the request body
    if (!req.body.paymentIntent) {
      return res.status(400).json({ error: "Payment intent is required." });
    }

    // Find the order and update it to mark it as completed
    const order = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.paymentIntent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    // Check if the order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({ message: "Order has been confirmed.", order });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    next(error);
  }
};
