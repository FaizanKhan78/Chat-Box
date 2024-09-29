import mongoose, { Schema, Types, model } from "mongoose";
const messageSchema = new Schema(
  {
    content: String,
    attachments: [
      {
        public_id: {
          type: String,
          require: true,
        },
        url: {
          type: String,
          require: true,
        },
      },
    ],
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.message || model("Message", messageSchema);
