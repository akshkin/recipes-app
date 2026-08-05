import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IRecipe extends mongoose.Document {
	createdBy: mongoose.Schema.Types.ObjectId;
	image: string;
	title: string;
	description: string;
	category: mongoose.Schema.Types.ObjectId;
	cuisine: mongoose.Schema.Types.ObjectId;
	prepTime: number;
	cookTime: number;
	servings: number;
	servingUnit?: string;
	dietaryTags: string[];
	ingredients: { ingredient: string }[];
	method: { step: string }[];
	review: mongoose.Schema.Types.ObjectId[];
	averageRating: number;
	ratingsCount: number;
	createdAt: Date;
}

export const DietaryTag = [
	"Vegetarian",
	"Vegan",
	"Gluten-Free",
	"Keto",
	"Paleo",
	"Pescatarian",
	"Low-Carb",
	"Low-Fat",
	"Dairy-Free",
	"Nut-Free",
	"Halal",
] as const;

const RecipeSchema = new Schema(
	{
		createdBy: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		image: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		prepTime: {
			type: Number,
			required: true,
			min: 1,
		},
		cookTime: {
			type: Number,
			required: true,
			min: 1,
		},
		servings: {
			type: Number,
			required: true,
			min: 1,
		},
		servingUnit: {
			type: String,
			required: false,
		},
		dietaryTags: {
			type: [{ type: String, enum: Object.values(DietaryTag) }],
			default: [],
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		cuisine: {
			type: Schema.Types.ObjectId,
			ref: "Cuisine",
		},
		review: [
			{
				type: Schema.Types.ObjectId,
				ref: "Review",
			},
		],
		ingredients: [
			{
				type: { ingredient: String },
				required: true,
			},
		],
		method: [
			{
				type: { step: String },
				required: true,
			},
		],
		averageRating: {
			type: Number,
			default: 0,
		},

		ratingsCount: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

const Recipe =
	mongoose.models?.Recipe || mongoose.model("Recipe", RecipeSchema);

export default Recipe;
