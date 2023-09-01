import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res, next) => {
  const query = req.query;

  const newConversation = new Conversation({
    id:
      query.isSeller == "true"
        ? query.userId + req.body.to
        : req.body.to + query.userId,
    sellerId: query.isSeller == "true" ? query.userId : req.body.to,
    buyerId: query.isSeller == "true" ? req.body.to : query.userId,
    readBySeller: query.isSeller == "true",
    readByBuyer: !query.isSeller == "true",
  });

  try {
    const savedConversation = await newConversation.save();

    res.status(201).send(savedConversation);
  } catch (error) {
    next(error);
  }
};

export const updateConversation = async (req, res, next) => {
  const query = req.query;

  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        id: req.params.id,
      },
      {
        $set: {
          ...(query.isSeller == "true"
            ? { readBySeller: true }
            : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (error) {
    next(error);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });

    if (!conversation) {
      next(createError(404, "Conversation not found!"));
    }

    res.send(200).send(conversation);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  const query = req.query;

  try {
    const conversations = await Conversation.find(
      query.isSeller == "true"
        ? { sellerId: query.userId }
        : { buyerId: query.userId }
    ).sort({ updatedAt: -1 });

    res.status(200).send(conversations);
  } catch (error) {
    next(error);
  }
};
