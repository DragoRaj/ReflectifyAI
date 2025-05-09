
import { Moon, Sun, Clock, MessageCircle, Settings } from "lucide-react";
import { MeditationPreset, MeditationPrompts } from "./types";

export const MEDITATION_PRESETS: MeditationPreset[] = [
  {
    id: "calm",
    name: "Calm & Relax",
    icon: <Moon className="h-5 w-5" />,
    duration: 300, // 5 minutes in seconds
    description: "Reduce stress and find your inner peace",
    color: "from-blue-400 to-indigo-500",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=calm-meditation-145038.mp3",
  },
  {
    id: "focus",
    name: "Improve Focus",
    icon: <Sun className="h-5 w-5" />,
    duration: 600, // 10 minutes in seconds
    description: "Sharpen your mind and enhance productivity",
    color: "from-amber-400 to-orange-500",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1ddd3c63da.mp3?filename=om-mantra-chanting-for-meditation-108-times-148551.mp3",
  },
  {
    id: "sleep",
    name: "Better Sleep",
    icon: <Moon className="h-5 w-5" />,
    duration: 900, // 15 minutes in seconds
    description: "Wind down and prepare for restful sleep",
    color: "from-indigo-500 to-purple-600",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_aeeb103b32.mp3?filename=positive-light-meditation-with-bells-theta-waves-and-rain-116057.mp3",
  },
  {
    id: "gratitude",
    name: "Gratitude",
    icon: <MessageCircle className="h-5 w-5" />,
    duration: 300, // 5 minutes in seconds
    description: "Cultivate appreciation and positivity",
    color: "from-teal-400 to-green-500",
    audioSrc: "https://cdn.pixabay.com/download/audio/2021/10/26/audio_fca7b3d63a.mp3?filename=meditation-soothing-music-for-yoga-and-self-affirmation-131543.mp3",
  },
  {
    id: "custom",
    name: "Custom Meditation",
    icon: <Settings className="h-5 w-5" />,
    duration: 300, // 5 minutes default
    description: "Personalized AI-powered meditation session",
    color: "from-purple-400 to-pink-500",
    audioSrc: "https://cdn.pixabay.com/download/audio/2021/10/26/audio_fca7b3d63a.mp3?filename=meditation-soothing-music-for-yoga-and-self-affirmation-131543.mp3",
  }
];

export const MEDITATION_PROMPTS: MeditationPrompts = {
  calm: [
    "Notice the gentle rhythm of your breath. Allow each inhale to bring calm and each exhale to release tension.",
    "Let your shoulders relax completely. Feel any tightness melting away with each breath.",
    "Imagine a peaceful place where you feel completely safe. Visualize the details – what do you see, hear, and feel?",
    "As thoughts arise, acknowledge them without judgment, then let them drift away like clouds in the sky.",
    "Feel the weight of your body supported completely. Allow yourself to surrender to this moment of rest.",
  ],
  focus: [
    "Direct your attention to the sensation of air flowing in and out of your nostrils. Just observe this natural process.",
    "If your mind wanders, gently bring it back to your breath. Each return is a moment of mindfulness.",
    "Notice the slight pause between inhaling and exhaling. Rest in that brief moment of complete stillness.",
    "Feel the subtle movements of your body as you breathe. Your chest rising and falling, your abdomen expanding and contracting.",
    "Focus on one point – perhaps the sensation where your breath feels most prominent. Let that anchor your attention.",
  ],
  sleep: [
    "Allow your body to become heavy as you release all effort. You don't need to do anything right now.",
    "Scan your body from head to toe, inviting each part to completely relax and let go.",
    "With each exhale, imagine sinking deeper into comfort and tranquility.",
    "Let go of today's events and tomorrow's concerns. This is your time to simply be.",
    "Notice the comforting weight of your body and the supportive surface beneath you.",
  ],
  gratitude: [
    "Bring to mind something simple you're grateful for today. Feel appreciation spreading through your body.",
    "Think of a person who has positively impacted your life. Send them silent thanks and well-wishes.",
    "Acknowledge a challenge that has helped you grow. Consider what strengths or insights you've gained.",
    "Appreciate your body and all it does for you, even the automatic processes that sustain your life.",
    "Reflect on the beauty that exists in your world – perhaps something in nature, art, or human connection.",
  ],
  custom: [] // This will be populated by AI based on user input
};
