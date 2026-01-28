import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IReview extends mongoose.Document {
  recipe: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  replies: { user: mongoose.Schema.Types.ObjectId; comment: string }[];
}

const ReviewSchema = new Schema({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
      },
    },
  ],
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
