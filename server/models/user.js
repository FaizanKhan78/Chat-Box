import mongoose, { Schema, Types, model } from "mongoose";
import { hash } from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
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
    groupAdmin: [
      {
        type: Types.ObjectId,
        ref: "Chat",
      },
    ],
    appAdmin: {
      type: Boolean,
      default: false,
    },
    number: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

// * Hashing the password.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hash(this.password, 10);
});

export const User = mongoose.models.User || model("User", userSchema);
