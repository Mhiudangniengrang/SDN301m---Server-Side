import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const brandSchema = new mongoose.Schema(
  { brandName: String },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Brand", brandSchema);




