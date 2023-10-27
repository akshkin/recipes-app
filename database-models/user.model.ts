import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IUser extends mongoose.Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  saved: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

export const UserScehma = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  image: { type: String },
  saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  joinedAt: { type: Date, default: Date.now() },
});

const User = mongoose.models.User || mongoose.model("User", UserScehma);

export default User;
