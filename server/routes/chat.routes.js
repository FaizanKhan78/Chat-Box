import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getFriendDetails,
  getMessages,
  leaveGroup,
  myChats,
  myGroupChats,
  newGroup,
  removeMember,
  renameGroup,
  setAttachment,
  updateGroupAdmin,
} from "../controllers/chat.js";
import { attachment } from "../middlewares/multer.js";
import {
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
  updateGroupAdminValidator,
  validateHandler,
} from "../utils/validators.js";
const app = express.Router();

app.use(isAuthenticated);

app.post("/new-group", newGroupValidator(), validateHandler, newGroup);

app.get("/my-chats", myChats);

app.get("/my-groups", myGroupChats);

app.patch(
  "/update-admin",
  updateGroupAdminValidator(),
  validateHandler,
  updateGroupAdmin
);

app.put("/add-members", addMemberValidator(), validateHandler, addMembers);

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

//* Send Messages

//* Get Chat Details,rename,delete
app
  .route("/:id")
  .get(getChatDetailsValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(), validateHandler, renameGroup)
  .delete(deleteChatValidator(), validateHandler, deleteChat);

export default app;
