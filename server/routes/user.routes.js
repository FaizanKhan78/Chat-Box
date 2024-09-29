import express from "express";
import {
  acceptFriendRequest,
  getAllNotification,
  getMyFriends,
  getMyProfile,
  login,
  logout,
  register,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../utils/validators.js";
import { isAuthenticated } from "./../middlewares/auth.js";

const app = express.Router();

app.post(
  "/register",
  singleAvatar,
  registerValidator(),
  validateHandler,
  register
);

app.post("/login", loginValidator(), validateHandler, login);

//* After Hear user must be login in to access the routes.

app.use(isAuthenticated);

app.get("/profile", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);

app.put(
  "/send-request",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

app.put(
  "/accept-request",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get("/get-notification", getAllNotification);

app.get("/friends", getMyFriends);

export default app;