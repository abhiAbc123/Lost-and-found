
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    type: { type: String, required: true }, 
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String },
    phone: { type: String }, 
    image: { type: String }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);

