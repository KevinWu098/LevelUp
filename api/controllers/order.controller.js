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
    const query = req.query;

    const orders = await Order.find({
      ...(query.isSeller == "true"
        ? { sellerId: query.userId }
        : { buyerId: query.userId }),
      isCompleted: true,
    });

    // // Filter every other order due to deployment crashing on `confirm` in the payment route. Previously, two orders were always created, but only one would be marked completed.
    // const everyOtherOrder = [];
    // for (let i = 0; i < orders.length; i += 2) {
    //   everyOtherOrder.push(orders[i]);
    // }

    // res.status(200).send(everyOtherOrder);
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

  const query = req.query;

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: query.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
    isCompleted: true, // Hard-coded due to deployment crashing on `confirm` in the payment route
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (error) {
    next(error);
  }
};
