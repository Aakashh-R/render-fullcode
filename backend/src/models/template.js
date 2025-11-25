// src/models/Template.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const templateSchema = new Schema(
  {
    id: { type: String, required: true, unique: true }, // logical id used in frontend
    title: { type: String, required: true },
    description: { type: String },
    fields: { type: Array, default: [] }, // consider more strict schema if needed
    templateBody: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in dev/hot-reload: reuse existing compiled model if present
const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);

export default Template;
