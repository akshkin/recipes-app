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
	joinedAt: Date;
	socialLinks?: {
		instagram: string;
		facebook: string;
		youTube: string;
	};
}

export const UserSchema = new Schema({
	clerkId: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String },
	bio: { type: String },
	image: { type: String },
	joinedAt: { type: Date, default: Date.now },
	socialLinks: {
		instagram: { type: String },
		facebook: { type: String },
		youTube: { type: String },
	},
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
