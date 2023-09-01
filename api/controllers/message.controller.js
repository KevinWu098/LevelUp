import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res, next) => {
  const query = req.query;

  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: query.userId,
    desc: req.body.desc,
  });

  try {
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: query.isSeller == "true",
          readByBuyer: !query.isSeller == "true",
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (error) {
    next(error);
  }
};
