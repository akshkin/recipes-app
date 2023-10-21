import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IRecipe extends mongoose.Document {
  createdBy: mongoose.Schema.Types.ObjectId;
  image: string;
  title: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  cuisine: mongoose.Schema.Types.ObjectId;
  imgredients: { ingredient: string }[];
  method: { step: string }[];
  review: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

export const RecipeScehma = new Schema({
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
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  cuisine: {
    type: Schema.Types.ObjectId,
    ref: "Cuisine",
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Recipe = mongoose.model("Recipe", RecipeScehma);
