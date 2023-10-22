import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface ICategory extends mongoose.Document {
  title: string;
  recipes: mongoose.Schema.Types.ObjectId[];
}

const CategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  recipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
