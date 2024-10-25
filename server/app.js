import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleWare } from "./middlewares/error.js";
import { connectDB } from "./utils/connectdb.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import adminRoutes from "./routes/admin.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import {
  CHAT_JOINT,
  CHAT_LEAVE,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/event.js";
import { getSocket } from "./utils/features.js";
import { Message } from "./models/message.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

//* Creating Fake Data for Testing.

//* To access .env variables in express.
dotenv.config();

//* To access express methods
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.set("io", io);

// * Passing Mongo DB URI
connectDB(process.env.MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// createUser(20);
// createSingleChats(10);
// createGroupChats(10);
// createMessageInChat("66e9477af83a99bdde3a926a", 50);
// * To convert the request data into json format
app.use(cors(corsOptions));
app.use(express.json());

// * To Access the Cookies
app.use(cookieParser());

// * Setting User Routes
app.use("/api/v1/user", userRoutes);

// * Setting Chat Routes
app.use("/api/v1/chat", chatRoutes);

// * Setting Admin Routes
app.use("/api/v1/admin", adminRoutes);

// * Testing Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

export const userSocketIds = new Map();
const onlineUsers = new Set();

io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.response,
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;

  userSocketIds.set(user._id.toString(), socket.id);
  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };
    const membersSocket = getSocket(members);

    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on(START_TYPING, async function ({ members, chatId }) {
    const membersSockets = getSocket(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, async function ({ members, chatId }) {
    const membersSockets = getSocket(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINT, ({ userId, members }) => {
    console.log(userId);
    console.log(members);
    onlineUsers.add(userId?.toString());

    const membersSocket = getSocket(members);

    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVE, ({ userId, members }) => {
    onlineUsers.delete(userId?.toString());

    const membersSocket = getSocket(members);

    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userSocketIds.delete(user._id.toString());
    // console.log("user disconnect");
    onlineUsers.delete(user._id?.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

// * error handling Middle ware
app.use(errorMiddleWare);

// * Making the Server using listen Function in Express.
server.listen(process.env.PORT, () => {
  console.log(
    `Server is Running At ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
