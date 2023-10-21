import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  // prevent unknown field queries
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("missing url");

  if (isConnected) {
    return console.log("MongoDB is already connected");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "dev-overflow",
    });
    isConnected = true;
  } catch (error) {
    console.log("Error connecting to Mongo");
  }
};
