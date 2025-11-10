
export const moodOptions = [
    { value: "happy", label: "Happy", emoji: "😁"},
    { value: "sad", label: "Sad", emoji: "😢"},
    { value: "angry", label: "Angry", emoji: "😠"},
    { value: "excited", label: "Excited", emoji: "🤩"},
    { value: "calm", label: "Calm", emoji: "😌"},
    { value: "inspired", label: "Inspired", emoji: "💡"},
    { value: "neutral", label: "Neutral", emoji: "😐"},
    { value: "stressed", label: "Stressed", emoji: "😰"},
    { value: "tired", label: "Tired", emoji: "🥱"},
] as const;

export const moodEmojis = Object.fromEntries(
    moodOptions.map(mood => [mood.value, mood.emoji])
) as Record<string, string>;