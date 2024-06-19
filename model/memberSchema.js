import mongoose from 'mongoose';


const memberSchema = new mongoose.Schema(
  {
    membername: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true }, 
    YOB: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Members", memberSchema);