import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface ICollection extends mongoose.Document {
	createdBy: string;
	name: string;
	recipes: mongoose.Schema.Types.ObjectId[];
	isDefault: boolean;
}

export const CollectionSchema = new Schema(
	{
		createdBy: { type: String, required: true, ref: "User" },
		name: { type: String, required: true, trim: true },
		recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
		isDefault: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

const Collection =
	mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);

export default Collection;
