import jwt from "jsonwebtoken";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { adminSecretKey, cookieOption, TryCatch } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

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
      maxAge: 24 * 60 * 60 * 1000,
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
    ({ content, attachments, sender, createdAt, chat, _id }) => ({
      _id,
      attachment: attachments.length !== 0 ? attachments[0].url : false,
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
export const getUserDetails = TryCatch(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new ErrorHandler("Invalid or missing User Id", 404));
  }

  // Fetch the user by userId
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get the number of groups the user is a member of (groupChat = true)
  const groups = await Chat.find({
    groupChat: true,
    members: userId,
  }).populate("creator", "name email number username avatar"); // Populate creator info

  // Get the user's friends (chats with 2 members only)
  const friends = await Chat.find({
    groupChat: false,
    members: userId,
    $expr: { $eq: [{ $size: "$members" }, 2] }, // Ensure only 2 members (user + friend)
  }).populate({
    path: "members",
    match: { _id: { $ne: userId } }, // Exclude the current user from populated members
    select: "name email number username avatar", // Fields to include in the populated members
  });

  // Construct userDetails object
  const userDetails = {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    number: user.number,
    avatar: user.avatar?.url, // Assuming avatar is an object with a 'url' field
    bio: user.bio || "No bio available",
    groups: groups.map((group) => ({
      _id: group._id,
      name: group.name, // Assuming group name exists
      creator: group.creator, // Populated creator info
      membersCount: group.members.length,
    })),
    friends: friends.map((friendChat) => ({
      _id: friendChat._id,
      friend: friendChat.members[0], // The other member, excluding the current user
    })),
  };

  // Return the response with user details
  return res.status(200).json({
    success: true,
    message: "User Details",
    data: userDetails,
  });
});

export const getChatsDetails = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) {
    return next(new ErrorHandler("Chat Id Require", 401));
  }

  const chat = await Chat.findById(chatId).populate("members groupAdmin");

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }
  return res
    .status(200)
    .json({ success: true, message: "Chat Details", chatDetails: chat });
});
