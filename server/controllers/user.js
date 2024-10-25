// * Create New User and Save to Data Base and Save it to cookie
import { compare } from "bcrypt";
import {
  cookieOption,
  emitEvent,
  getOtherMember,
  sendToken,
  TryCatch,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { User } from "./../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Request } from "./../models/request.js";
import { NEW_FRIEND_REQUEST, REFETCH_CHATS } from "../constants/event.js";
export const register = async (req, res, next) => {
  try {
    const { name, username } = req.body;

    const file = req.file; // File should now be in req.file

    if (!file) {
      return next(new ErrorHandler("Avatar required", 400));
    }

    const userExist = await User.findOne({ username, name });
    if (userExist) {
      return next(
        new ErrorHandler(`${username} already exists, please login`, 400)
      );
    }

    // Upload file to Cloudinary
    const result = await uploadFilesToCloudinary([file]);

    const payload = {
      ...req.body,
      avatar: {
        public_id: result[0].public_id,
        url: result[0].url,
      },
    };

    const user = await User.create(payload);

    sendToken(res, user, 200, "User Created");
  } catch (error) {
    next(error);
  }
};

export const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Credentials", 400));
  }
  const isPasswordMatch = compare(password, user.password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Credentials", 400));
  }

  sendToken(res, user, 200, `Welcome Back ${user.username}`);
});

export const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.userID);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }
  res.status(200).json(user);
});

export const logout = (req, res) => {
  return res
    .status(200)
    .cookie("chat-box-token", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logout Successfully",
    });
};

export const searchUser = TryCatch(async (req, res) => {
  const { username = "" } = req.query;

  const myChats = await Chat.find({ groupChat: false, members: req.userID });

  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  const allUsersAcceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    username: { $regex: username, $options: "i" },
  });

  const users = allUsersAcceptMeAndFriends.map(
    ({ _id, username, name, avatar, createdAt }) => ({
      _id,
      name,
      username,
      avatar: avatar.url,
      createdAt,
    })
  );

  return res.status(200).json({
    success: true,
    users,
  });
});

export const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.userID, receiver: userId },
      { sender: userId, receiver: req.userID },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.userID,
    receiver: userId,
  });

  emitEvent(req, NEW_FRIEND_REQUEST, [userId], "Friend Request");
  return res
    .status(200)
    .json({ success: true, message: "Friend Request Sent" });
});

export const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name avatar")
    .populate("receiver", "name avatar");

  if (!request) return next(new ErrorHandler("Request Not Found", 404));

  if (request.receiver._id.toString() !== req.userID.toString()) {
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );
  }

  if (!accept) {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name} - ${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

export const getAllNotification = TryCatch(async (req, res, next) => {
  const request = await Request.find({ receiver: req.userID }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = request.map(({ _id, sender, createdAt }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
    createdAt,
  }));

  return res.status(200).json({
    success: true,
    request: allRequests,
  });
});

export const getMyFriends = TryCatch(async (req, res, next) => {
  const { chatId } = req.query;

  const chat = await Chat.find({
    members: req.userID,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chat.map(({ members }) => {
    const otherUser = getOtherMember(members, req.userID);
    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export const updateBio = TryCatch(async (req, res, next) => {
  const { bio } = req.body;

  const userId = req.userID;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  user.bio = bio;
  user.save();
  return res.status(200).json({
    success: true,
    message: "Bio Updated Successfully",
  });
});

export const updateDetails = TryCatch(async (req, res, next) => {
  const userId = req.userID;
  const { email, ...rest } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // Check if the email is already used by another user
  if (email) {
    const emailExists = await User.findOne({ email, _id: { $ne: userId } });
    if (emailExists) {
      return next(new ErrorHandler("Email is already in use", 400)); // handle duplicate email
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { email, ...rest },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Details Updated Successfully",
    updateUser,
  });
});
