import {
  ALERT,
  COUNT_ATTACHMENTS,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/event.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  getOtherMember,
  TryCatch,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Message } from "./../models/message.js";

export const newGroup = TryCatch(async (req, res, next) => {
  const { name, avatar, members } = req.body;

  if (members.length < 2) {
    return next(
      new ErrorHandler("Group Chat must have at least 3 members", 400)
    );
  }

  const allMembers = [...members, req.userID];

  // Create the new chat group
  const newChat = await Chat.create({
    name,
    groupChat: true,
    avatar,
    creator: req.userID,
    members: allMembers,
  });

  // Add the new group ID to the user's admin array
  await User.findByIdAndUpdate(req.userID, {
    $push: { groupAdmin: newChat._id },
  });

  // Emit events for the group creation
  emitEvent(req, ALERT, allMembers, `Welcome to ${name} Group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Chat Created",
  });
});

export const myChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.userID }).populate(
    "members",
    "name username avatar"
  );

  const transformedChats = chats.map(
    ({ _id, name, members, groupChat, avatar }) => {
      if (groupChat) {
        return {
          _id,
          groupChat,
          avatar: avatar.url,
          name: name,
          members: members.reduce((prev, curr) => {
            if (curr._id.toString() !== req.userID.toString()) {
              prev.push(curr._id);
            }
            return prev;
          }, []),
        };
      }
      const otherMember = getOtherMember(members, req.userID);
      return {
        _id,
        groupChat,
        avatar: otherMember.avatar.url,
        name: otherMember.name,
        username: otherMember.username,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.userID.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    }
  );

  res.status(200).json({
    success: true,
    chat: transformedChats,
  });
});

export const myGroupChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({
    members: req.userID,
    groupChat: true,
    creator: req.userID,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name, avatar }) => ({
    _id,
    name,
    members,
    groupChat,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});
export const addGroupAdmin = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  // Check if chat exists
  let chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  // Fetch all members' details
  const getUsersDetails = members.map((member) => User.findById(member));
  const users = await Promise.all(getUsersDetails);

  // Check if any user is not found
  if (users.some((user) => !user)) {
    return next(new ErrorHandler("One or more users not found", 404));
  }

  // Update users and chat only if they are not already group admins
  users.forEach((user) => {
    if (!user.groupAdmin.includes(chatId)) {
      user.groupAdmin.push(chatId);
    }
    if (!chat.groupAdmin.includes(user._id)) {
      chat.groupAdmin.push(user._id);
    }
  });

  // Save all users and chat concurrently
  try {
    await Promise.all([...users.map((user) => user.save()), chat.save()]);
  } catch (error) {
    return next(new ErrorHandler("Error saving group admin updates", 500));
  }

  chat = await Chat.findById(chatId).populate("groupAdmin", "name avatar");

  console.log(chat);

  const updateGroupAdmin = chat.groupAdmin.map((admin) => ({
    name: admin.name,
    avatar: admin.avatar.url,
  }));

  return res.status(200).json({
    success: true,
    message: "Admin Added Successfully",
    updateGroupAdmin,
  });
});

export const removeGroupAdmin = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is Not a Group Chat", 400));
  }
  if (chat.creator.toString() !== req.userID.toString()) {
    return next(new ErrorHandler("You are not allowed to add members", 403));
  }

  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group Must Have at least 3 members", 400));
  }
  const allChatMembers = chat.members.filter((i) => i.toString());

  chat.groupAdmin = chat.groupAdmin.filter(
    (i) => i.toString() !== userId.toString()
  );
  await chat.save();

  emitEvent(req, ALERT, chat.members, {
    message: `${userThatWillBeRemoved.name} has been removed from the Admin Role`,
    chatId,
  });

  // console.log(allChatMembers);

  emitEvent(req, REFETCH_CHATS, allChatMembers);

  return res.status(200).json({
    success: true,
    message: "Member removed Successfully",
  });
});

export const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1) {
    return next(new ErrorHandler("Please Provide Members", 400));
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is Not a Group Chat", 400));
  }

  if (
    chat.creator.toString() !== req.userID.toString() ||
    !chat.groupAdmin.find((i) => i.toString() === req.userID.toString())
  ) {
    return next(new ErrorHandler("You are not allowed to add members", 403));
  }

  const allNewMembersPromise = members.map((i) =>
    User.findById(i, "name avatar")
  );

  const allMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler("Group Member Limit Reached", 400));
  }

  await chat.save();

  const allUserName = allMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUserName} have been added in Group`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added Successfully",
  });
});

export const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is Not a Group Chat", 400));
  }
  if (chat.creator.toString() !== req.userID.toString()) {
    return next(new ErrorHandler("You are not allowed to add members", 403));
  }

  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group Must Have at least 3 members", 400));
  }
  const allChatMembers = chat.members.filter((i) => i.toString());

  chat.members = chat.members.filter((i) => i.toString() !== userId.toString());
  chat.groupAdmin = chat.groupAdmin.filter(
    (i) => i.toString() !== userId.toString()
  );
  await chat.save();

  emitEvent(req, ALERT, chat.members, {
    message: `${userThatWillBeRemoved.name} has been removed from the Group`,
    chatId,
  });

  // console.log(allChatMembers);

  emitEvent(req, REFETCH_CHATS, allChatMembers);

  return res.status(200).json({
    success: true,
    message: "Member removed Successfully",
  });
});

export const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This is Not a Group Chat", 400));
  }

  const remainingMember = chat.members.filter(
    (member) => member.toString() !== req.userID.toString()
  );

  const remainingAdmin = chat.groupAdmin.filter(
    (admin) => admin.toString() !== req.userID.toString()
  );

  if (
    chat.creator.toString() === req.userID.toString() &&
    remainingAdmin.length > 0
  ) {
    const randomElement = Math.floor(Math.random() * remainingAdmin.length);

    const newCreator = remainingAdmin[randomElement];

    chat.creator = newCreator;
  } else if (chat.creator.toString() === req.userID.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMember.length);

    const newCreator = remainingMember[randomElement];
    chat.groupAdmin.pull(req.userID);
    chat.groupAdmin.push(newCreator);
    chat.creator = newCreator;
  }
  chat.members = remainingMember;

  const user = await Promise.all([
    User.findById(req.userID, "name"),
    await chat.save(),
  ]);

  // No matching document found for id "670a6876a5b42e3947023153" version 0 modifiedPaths "groupAdmin, creator, members"

  emitEvent(req, ALERT, chat.members, {
    chatId,
    message: `User ${user.name} has left the group`,
  });

  return res.status(200).json({
    success: true,
    message: "Leave the Group Successfully",
  });
});

export const setAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const files = req.files || [];

  if (files.length < 1 || files.length > 5) {
    return next(new ErrorHandler("File Length Should be between 1-5", 400));
  }

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.userID, "name"),
  ]);

  const isMember = chat.members.find(
    (member) => member.toString() === req.userID.toString()
  );
  if (!isMember) {
    return next(new ErrorHandler("You Are Not A Member of this Chat", 400));
  }

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }
  const attachments = await uploadFilesToCloudinary(files);
  // Upload File.
  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
      avatar: me.avatar,
    },
  };

  const alertMembers = chat.members.filter(
    (member) => member !== req.userID.toString()
  );

  const message = await Message.create(messageForDB);

  console.log("Message created", message);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chatId,
  });
  emitEvent(req, COUNT_ATTACHMENTS, alertMembers, {
    message: attachments,
    chatId,
  });
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
  return res.status(200).json({
    success: true,
    message,
  });
});

export const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .populate("groupAdmin", "name avatar")
      .populate("creator", "name avatar")
      .lean();

    if (!chat) {
      return next(new ErrorHandler("Chat Not Found", 404));
    }
    const isMember = chat.members.find(
      (member) => member._id.toString() === req.userID.toString()
    );
    if (!isMember) {
      return next(new ErrorHandler("You Are Not A Member of this Chat", 400));
    }
    chat.groupAdmin = chat.groupAdmin.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
    chat.creator = {
      _id: chat.creator._id,
      name: chat.creator.name,
      avatar: chat.creator.avatar.url,
    };
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return next(new ErrorHandler("Chat Not Found", 404));
    }
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

export const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This Is not a Group Chat", 404));
  }

  if (name === chat.name) {
    return next(
      new ErrorHandler("Name is Same write another name Please...", 401)
    );
  }
  const isAdmin = chat.groupAdmin.find(
    (ad) => ad.toString() === req.userID.toString()
  );

  if (chat.creator.toString() !== req.userID.toString() && !isAdmin) {
    return next(
      new ErrorHandler("You are Not Allowed To Rename the Group", 403)
    );
  }

  chat.name = name;
  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group re-named Successfully",
  });
});

export const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat Not Found", 404));
  }

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.userID.toString()) {
    return next(
      new ErrorHandler("You are not allowed to delete the group", 403)
    );
  }

  if (!chat.groupChat && !members.includes(req.userID.toString())) {
    return next(
      new ErrorHandler("You are not allowed to delete the group", 403)
    );
  }

  //* Here we have to delete All Messages as well as attachment and file from cloudnary

  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachment: { $exists: true, $ne: [] },
  });

  const public_ids = [];
  messageWithAttachments.forEach(({ attachment }) => {
    attachment.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });
  await Promise.all([
    // Delete File From Cloudnary
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Chat Deleted Successfully",
  });
});

export const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  const result_per_page = 20;
  const skip = (page - 1) * result_per_page;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.members.includes(req.userID.toString())) {
    return next(
      new ErrorHandler("You are not allowed to access this chat", 403)
    );
  }

  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(result_per_page)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessagesCount / result_per_page) || 0;

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export const getFriendDetails = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const messages = await Message.find({ chat: chatId });

  if (!messages) {
    return next(new Error("Messages not found", 404));
  }

  // Use `lean()` to get a plain JavaScript object
  const chat = await Chat.findById(chatId)
    .populate("members", "name username avatar bio")
    .lean(); // Add this to convert Mongoose document to plain object

  if (chat.groupChat) {
    console.log(chat);
    let details = {
      ...chat,
      avatar: chat.avatar.url,
      bio: chat.avatar.bio,
      attachments: chat.attachments,
      members: chat.members.map((member) => ({
        avatar: member.avatar.url,
        name: member.name,
        username: member.username,
        groupAdmin: chat.groupAdmin.some(
          (id) => id?.toString() === member._id.toString()
        ),
        creator: chat?.creator?.toString() === member?._id?.toString(),
      })),
    };
    return res.status(200).json({
      success: true,
      messages,
      details,
    });
  } else {
    let details = chat.members.filter(
      (member) => member._id.toString() !== req.userID.toString()
    );
    details = {
      bio: details[0].bio,
      avatar: details[0].avatar.url,
      name: details[0].name,
      username: details[0].username,
    };
    return res.status(200).json({
      success: true,
      messages,
      details,
    });
  }
});

export const deleteOrRenameGroupAvatar = TryCatch(async (req, res, next) => {
  const { public_id, isDelete = false, chatId } = req.body;
  const file = req.file;
  if (!chatId) {
    return next(new ErrorHandler("Chat Id Require", 400));
  }

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.userID, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler("Chat doesn't Exist", 400));
  }

  if (isDelete) {
    const response = await deleteFilesFromCloudinary([public_id]);
    if (response[0].result === "not found") {
      return next(new ErrorHandler("Image not Found", 404));
    }
    chat.avatar.public_id = "";
    chat.avatar.url = "";
    chat.save();
    emitEvent(req, REFETCH_CHATS, chat.members);
    emitEvent(req, ALERT, chat.members, {
      message: `${chat.name} Avatar Delete Successfully`,
      chatId,
    });
    return res
      .status(200)
      .json({ success: true, message: "Avatar deleted Successfully" });
  } else {
    if (public_id) {
      await deleteFilesFromCloudinary([public_id]);
    }
    const attachment = await uploadFilesToCloudinary([file]);
    // console.log(attachment);
    chat.avatar.public_id = attachment[0].public_id;
    chat.avatar.url = attachment[0].url;
    chat.save();

    const messageForDB = {
      content: "Group Avatar Change",
      sender: me._id,
      chat: chatId,
    };

    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id,
        name: me.name,
        avatar: me.avatar,
      },
    };
    // console.log(messageForRealTime);
    emitEvent(req, REFETCH_CHATS, chat.members);

    //? Add emit of all the group members must get the message that group icon has change

    emitEvent(req, ALERT, chat.members, {
      message: `${chat.name} Avatar updated Successfully`,
      chatId,
    });
    return res
      .status(200)
      .json({ success: true, message: "Avatar Updated Successfully" });
  }
});
