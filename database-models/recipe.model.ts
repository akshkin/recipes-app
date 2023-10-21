import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IRecipe extends mongoose.Document {
  createdBy: string;
  image: string;
  title: string;
  description: string;
  category: mongoose.Schema.Types.ObjectId;
  cuisine: mongoose.Schema.Types.ObjectId;
  ingredients: { ingredient: string }[];
  method: { step: string }[];
  review: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const RecipeScehma = new Schema({
  createdBy: {
    type: String,
    required: true,
    // ref: "User",
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Recipe = mongoose.models.Recipe || mongoose.model("Recipe", RecipeScehma);

export default Recipe;
