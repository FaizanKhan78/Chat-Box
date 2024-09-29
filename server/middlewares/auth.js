import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey, TryCatch } from "../utils/features.js";
import { User } from "../models/user.js";

export const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies["chat-box-token"];

  if (!token) {
    return next(new ErrorHandler("Please Login to access the route", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.userID = decodedData._id;

  next();
});

export const isAdmin = (req, res, next) => {
  const token = req.cookies["chat-box-admin-token"];

  if (!token) {
    return next(new ErrorHandler("Only Admin Can access this route", 401));
  }
  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatch = secretKey === adminSecretKey;

  if (!isMatch) {
    return next(new ErrorHandler("Only Admin Can access this route", 401));
  }

  next();
};

export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(new ErrorHandler(err));
    const authToken = socket.request.cookies["chat-box-token"];
    if (!authToken)
      return next(new ErrorHandler("Please Login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);
    if (!user)
      return next(new ErrorHandler("Please Login to access this route", 401));

    socket.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please Login to access this route", 401));
  }
};
