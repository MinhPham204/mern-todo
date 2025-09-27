import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    dueAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Todo", TodoSchema);
