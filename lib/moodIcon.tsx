import { moodEnum } from "@/db/schema";
import { Smile, Frown, Meh, Zap, AlertTriangle } from "lucide-react";

type Mood = (typeof moodEnum.enumValues)[number];

const getMoodIcon = (mood: Mood, className?: string) => {
    switch (mood) {
        case "happy":
            return <Smile className={`text-yellow-500 ${className ?? " "}`} />;
        case "sad":
            return <Frown className={`text-blue-500 ${className ?? " "}`} />;
        case "neutral":
            return <Meh className={`text-gray-400 ${className ?? " "}`} />;
        case "anxious":
            return <AlertTriangle className={`text-orange-500 ${className ?? " "}`} />;
        case "excited":
            return <Zap className={`text-pink-500 ${className ?? " "}`} />;
        default:
            return <Meh className={`text-gray-400 ${className ?? " "}`} />;
    }
}

export default getMoodIcon;