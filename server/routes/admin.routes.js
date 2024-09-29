import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  getAdminData,
  getAllUsers,
  getDashBoardStats,
} from "../controllers/admin.js";
import { adminValidator, validateHandler } from "../utils/validators.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();

app.post("/verify", adminValidator(), validateHandler, adminLogin);

app.get("/logout", adminLogout);

//* Only Admin Can Access the Routes

app.use(isAdmin);

app.get("/", getAdminData);

app.get("/users", getAllUsers);

app.get("/chats", allChats);

app.get("/messages", allMessages);

app.get("/stats", getDashBoardStats);

export default app;
