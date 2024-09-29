import mongoose from "mongoose";

//* Connecting to MongoDB and Setting the Data Base Name.
export const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "ChatBox" })
    .then((data) => {
      console.log(`Connected to DB ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};
