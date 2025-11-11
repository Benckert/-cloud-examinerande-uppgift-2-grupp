import mongoose, { Schema, InferSchemaType, Types } from "mongoose";

const entrySchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: {
      type: String,
      enum: [
        "happy",
        "sad",
        "angry",
        "excited",
        "calm",
        "inspired",
        "neutral",
        "stressed",
        "tired",
      ],
      default: "neutral",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export type Entry = InferSchemaType<typeof entrySchema> & {
  createdBy: Types.ObjectId;
};

export const EntryModel = mongoose.model("Entry", entrySchema);
