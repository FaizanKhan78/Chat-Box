import express from "express";
import {
  acceptFriendRequest,
  deleteOrUpdateAvatar,
  getAllNotification,
  getMyFriends,
  getMyProfile,
  login,
  logout,
  register,
  searchUser,
  sendFriendRequest,
  updateBio,
  updateDetails,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  updateBioValidator,
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

app.patch("/update-bio", updateBioValidator(), validateHandler, updateBio);

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

app.patch("/user-avatar", singleAvatar, deleteOrUpdateAvatar);

app.patch("/update-details", updateDetails);

app.get("/get-notification", getAllNotification);

app.get("/friends", getMyFriends);

export default app;
