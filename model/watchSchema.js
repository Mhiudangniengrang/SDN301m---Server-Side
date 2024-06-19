import mongoose from "mongoose";
import commentSchema from "./comment.js";
// Declare the Schema of the Mongo model

//watch schema
const watchSchema = new mongoose.Schema(
  {
    watchName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    Automatic: { type: Boolean, default: false },
    watchDescription: { type: String, required: true },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Watch", watchSchema);
