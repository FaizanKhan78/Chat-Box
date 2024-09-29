import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { userSocketIds } from "../app.js";
export const cookieOption = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

export const sendToken = (res, user, code, message) => {
  // * Creating token and sending in cookies
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // console.log(token);
  return res.status(code).cookie("chat-box-token", token, cookieOption).json({
    success: true,
    message,
  });
};

export const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "shahidshaikh";

export const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const userSocketIds = getSocket(users);
  io.to(userSocketIds).emit(event, data);
};

export const getOtherMember = (members, userID) => {
  return members.find((member) => member._id.toString() !== userID.toString());
};

export const deleteFilesFromCloudinary = async (public_ids) => {};

export const getSocket = (users = []) => {
  const sockets = users.map((user) => userSocketIds.get(user.toString()));
  return sockets;
};

export const uploadFilesToCloudinary = async (files = []) => {
  try {
    // Use Promise.all to handle multiple file uploads
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        // Use upload_stream for uploading from memory
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            public_id: uuid(), // Generate a unique public ID for each file
          },
          (error, result) => {
            if (error) return reject(error); // Handle upload errors
            resolve(result); // Resolve with result
          }
        );
        uploadStream.end(file.buffer); // End the stream with the file buffer
      });
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Format the results to include public_id and url
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    throw new Error("Error uploading files to Cloudinary");
  }
};
