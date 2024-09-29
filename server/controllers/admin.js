import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { adminSecretKey, cookieOption, TryCatch } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";

export const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatch = secretKey === adminSecretKey;

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Admin Key", 401));
  }

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("chat-box-admin-token", token, {
      ...cookieOption,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authorization successful",
    });
});

export const getAdminData = TryCatch(async (req, res, next) => {
  return res.status(200).json({
    admin: true,
  });
});
export const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("chat-box-admin-token", "", {
      ...cookieOption,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();

  const transformUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return {
        _id,
        name,
        username,
        avatar: avatar.url,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    success: true,
    data: transformUsers,
  });
});

export const allChats = TryCatch(async (req, res, next) => {
  let chats = await Chat.find()
    .populate("members", "name avatar")
    .populate("creator", "name avatar")
    .populate("groupAdmin", "name avatar");

  // Transform chats including groupAdminCount and other required fields
  const transformedChats = await Promise.all(
    chats.map(async (chat) => {
      const { members, _id, groupChat, name, creator, avatar, groupAdmin } =
        chat;

      // Fetch the total messages count for the chat
      const totalMessages = await Message.countDocuments({ chat: _id });

      // Return the transformed chat object
      return {
        _id,
        groupChat,
        name,
        avatar: avatar ? avatar.url : "None", // Handle missing avatar
        members: members.map((member) => ({
          _id: member._id,
          name: member.name,
          avatar: member.avatar ? member.avatar.url : "None", // Handle missing avatar
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar?.url || "None", // Handle missing avatar
        },
        totalMessages,
        totalMembers: members.length,
        groupAdminCount: groupChat ? groupAdmin.length : 0, // Add groupAdminCount if groupChat
      };
    })
  );

  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

export const allMessages = TryCatch(async (req, res, next) => {
  const messages = await Message.find()
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transFormedMessages = messages.map(
    ({ content, attachment, sender, createdAt, chat, _id }) => ({
      _id,
      attachment,
      content,
      createdAt,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
      chat: chat._id,
      groupChat: chat.groupChat,
    })
  );

  return res.status(200).json({
    success: true,
    messages: transFormedMessages,
  });
});

export const getDashBoardStats = TryCatch(async (req, res, next) => {
  const [groupChatCount, singleChatCount, userCount, chatCount, messageCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      Chat.countDocuments({ groupChat: false }),
      User.countDocuments(),
      Chat.countDocuments(),
      Message.countDocuments(),
    ]);

  const today = new Date();
  const lastSevenDays = new Date();
  lastSevenDays.setDate(lastSevenDays.getDate() - 7);

  const lastSevenDaysMessages = await Message.find({
    createdAt: { $gte: lastSevenDays, $lte: today },
  }).select("createdAt");

  const messages = new Array(7).fill(0);

  const daysInMileSeconds = 1000 * 60 * 60 * 24;

  lastSevenDaysMessages.forEach((message) => {
    const index = Math.floor(
      (today.getTime() - message.createdAt.getTime()) / daysInMileSeconds
    );

    messages[6 - index]++;
  });

  const stats = {
    groupChatCount,
    singleChatCount,
    userCount,
    chatCount,
    messageCount,
    messagesChart: messages,
  };
  return res.status(200).json({
    success: true,
    stats,
  });
});
