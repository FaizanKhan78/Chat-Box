import express from "express";
import {
  addGroupAdmin,
  addMembers,
  deleteChat,
  deleteOrRenameGroupAvatar,
  getChatDetails,
  getFriendDetails,
  getMessages,
  leaveGroup,
  myChats,
  myGroupChats,
  newGroup,
  removeGroupAdmin,
  removeMember,
  renameGroup,
  setAttachment,
} from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachment, singleAvatar } from "../middlewares/multer.js";
import {
  addGroupAdminValidator,
  addMemberValidator,
  deleteChatValidator,
  getChatDetailsValidator,
  getFriendValidator,
  getMessagesValidator,
  leaveGroupValidator,
  newGroupValidator,
  removeMemberValidator,
  renameGroupValidator,
  sendAttachmentValidator,
  validateHandler,
} from "../utils/validators.js";
const app = express.Router();

app.use(isAuthenticated);

app.post("/new-group", newGroupValidator(), validateHandler, newGroup);

app.get("/my-chats", myChats);

app.get("/my-groups", myGroupChats);

app.put("/add-members", addMemberValidator(), validateHandler, addMembers);

app.patch(
  "/add-group-admin",
  addGroupAdminValidator(),
  validateHandler,
  addGroupAdmin
);

app.delete(
  "/remove-member",
  removeMemberValidator(),
  validateHandler,
  removeMember
);

app.delete("/leave/:id", leaveGroupValidator(), validateHandler, leaveGroup);

//* Send Attachments
app.post(
  "/attachment",
  attachment,
  sendAttachmentValidator(),
  validateHandler,
  setAttachment
);

//* Get Messages
app.get("/message/:id", getMessagesValidator(), validateHandler, getMessages);

app.get(
  "/get-friend-details/:id",
  getFriendValidator(),
  validateHandler,
  getFriendDetails
);

//* Delete or Rename Group Avatar

app.patch("/group-avatar", singleAvatar, deleteOrRenameGroupAvatar);

//* Remove Group Admin
app.patch(
  "/remove-admin",
  removeMemberValidator(),
  validateHandler,
  removeGroupAdmin
);

//* Get Chat Details,rename,delete
app
  .route("/:id")
  .get(getChatDetailsValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroup)
  .delete(deleteChatValidator(), validateHandler, deleteChat);
export default app;
