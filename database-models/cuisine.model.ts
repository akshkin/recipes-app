import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface ICuisine extends mongoose.Document {
  title: string;
  recipes: mongoose.Schema.Types.ObjectId[];
}

const CuisineSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  recipes: [
    {
      type: String,
      ref: "Recipe",
    },
  ],
});

const Cuisine =
  mongoose.models.Cuisine || mongoose.model("Cuisine", CuisineSchema);

export default Cuisine;
