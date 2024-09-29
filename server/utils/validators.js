import { body, validationResult, query, param } from "express-validator";

export const registerValidator = () => [
  body("name").notEmpty().withMessage("Name is required").isString(),
  body("username").notEmpty().withMessage("Username is required").isString(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
];

export const loginValidator = () => [
  body("username").notEmpty().withMessage("Username is required").isString(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const newGroupValidator = () => [
  body("name")
    .notEmpty()
    .withMessage("Group name is required")
    .isString()
    .withMessage("Group name must be a string"),

  body("members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members array must have at least 2 members and less then 100")
    .custom((members) => {
      if (members.length < 2) {
        throw new Error("At least 2 members are required");
      }
      return true;
    }),
];

export const addMemberValidator = () => [
  body("chatId", "Please Enter Chat Id").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members Must be 1-97"),
];

export const updateGroupAdminValidator = () => [
  query("groupId")
    .notEmpty()
    .withMessage("Group ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Group ID"),

  query("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid User ID"),
];

export const removeMemberValidator = () => [
  body("userId").notEmpty().withMessage("User ID is required"),

  body("chatId").notEmpty().withMessage("Chat ID is required"),
];

export const leaveGroupValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Chat ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid Chat ID"),
];

export const sendAttachmentValidator = () => [
  body("chatId")
    .notEmpty()
    .withMessage("Chat ID is required")
    .isMongoId()
    .withMessage("Invalid Chat ID format"),
];

export const getMessagesValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Chat ID is required")
    .isMongoId()
    .withMessage("Invalid Chat ID format"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
];

export const getChatDetailsValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Chat ID is required")
    .isMongoId()
    .withMessage("Invalid Chat ID format"),
  query("populate")
    .optional()
    .isIn(["true", "false"])
    .withMessage('Populate parameter must be "true" or "false"'),
];

export const renameGroupValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Chat ID is required")
    .isMongoId()
    .withMessage("Invalid Chat ID format"),
  body("name")
    .notEmpty()
    .withMessage("Group name is required")
    .isLength({ max: 100 })
    .withMessage("Group name should not exceed 100 characters"),
];

export const deleteChatValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Chat ID is required")
    .isMongoId()
    .withMessage("Invalid Chat ID format"),
];

export const getFriendValidator = () => [
  param("id")
    .notEmpty()
    .withMessage("Chat ID is required")
    .isMongoId()
    .withMessage("Invalid Chat ID format"),
];

export const sendRequestValidator = () => [
  body("userId", "Please Enter User Id").notEmpty(),
];
export const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request Id").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Request")
    .isBoolean()
    .withMessage("Accept Must Be Boolean"),
];

export const adminValidator = () => [
  body("secretKey").notEmpty().withMessage("Key Required"),
];

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const error = errors.errors.map((e) => e.msg).join(",");

  if (errors.isEmpty()) {
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};
