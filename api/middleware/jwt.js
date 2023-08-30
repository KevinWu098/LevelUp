import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  // Due to technical limitations on deployment through Render, tokens can't be used https://stackoverflow.com/a/71889837/22012164

  // const token = req.cookies.accessToken;

  // if (!token) {
  //   return next(createError(401, "User is not authenticated!"));
  // }

  // jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
  //   if (err) {
  //     return next(createError(403, "Token is not valid!"));
  //   }

  //   req.userId = payload.id;
  //   req.isSeller = payload.isSeller;

  //   next();
  // });

  const { userId, isSeller } = req.query;

  req.userId = userId;
  req.isSeller = isSeller;

  next();
};
