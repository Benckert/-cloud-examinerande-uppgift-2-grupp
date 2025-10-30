import mongoose, { Schema, InferSchemaType } from "mongoose";

const journalSchema = new Schema(
  {
    title: { type: String },
    content: { type: String },
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
  { timestamps: true }
);

export type Journal = InferSchemaType<typeof journalSchema>;

export const JournalModel = mongoose.model("Journal", journalSchema);
