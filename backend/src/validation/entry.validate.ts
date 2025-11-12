import { z } from "zod";

const entryValidation = z.object({
    title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty"),

    content: z
    .string()
    .trim()
    .min(1, "Entry cannot be empty"),

    tags: z
    .enum(["happy",
            "sad",
            "angry",
            "excited",
            "calm",
            "inspired",
            "neutral",
            "stressed",
            "tired",
    ]).default("neutral"),
})

export default entryValidation;