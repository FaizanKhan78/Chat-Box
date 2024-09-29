import mongoose, { Schema, Types, model } from "mongoose";

const chatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    groupChat: {
      type: Boolean,
      default: false,
    },
    avatar: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    creator: {
      type: Types.ObjectId,
      ref: "User",
    },
    groupAdmin: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Enable virtual fields if you need them
      transform: function (doc, ret) {
        // Remove `groupAdmin` field if `groupChat` is false
        if (!ret.groupChat) {
          delete ret.groupAdmin;
        }
        return ret;
      },
    },
    toObject: {
      virtuals: true, // Enable virtual fields if you need them
      transform: function (doc, ret) {
        // Remove `groupAdmin` field if `groupChat` is false
        if (!ret.groupChat) {
          delete ret.groupAdmin;
        }
        return ret;
      },
    },
  }
);

// Add the admin (groupAdmin) field only when creating a new chat
chatSchema.pre("save", function (next) {
  if (this.isNew) {
    if (this.groupChat) {
      // If group chat, add the creator to the groupAdmin array
      this.groupAdmin.push(this.creator);
    } else {
      // For non-group chats, clear groupAdmin and ensure creator is set
      this.groupAdmin = []; // Empty groupAdmin array
      this.creator = this.members[0]; // Ensure creator is one of the members
    }
  }
  next();
});

export const Chat = mongoose.models.Chat || model("Chat", chatSchema);
