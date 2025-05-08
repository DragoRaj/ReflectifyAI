
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Moon, Sun, Clock, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAIAnalysis } from "@/utils/aiUtils";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";

type MeditationTheme = "calm" | "focus" | "sleep" | "gratitude" | "custom";

interface MeditationPreset {
  id: MeditationTheme;
  name: string;
  icon: React.ReactNode;
  duration: number;
  description: string;
  color: string;
  audioSrc: string;
}

const MEDITATION_PRESETS: MeditationPreset[] = [
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

const prompts = {
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

const MindfulnessSession = () => {
  const [selectedPreset, setSelectedPreset] = useState<MeditationPreset | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState<number>(300); // Default 5 minutes
  const [customPrompts, setCustomPrompts] = useState<string[]>([]);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState<boolean>(false);
  const [customIntention, setCustomIntention] = useState<string>("");
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState<boolean>(false);
  
  const { isDarkMode } = useTheme();
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const selectPreset = (preset: MeditationPreset) => {
    if (isPlaying) {
      pauseSession();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (preset.id === "custom") {
      setIsCustomDialogOpen(true);
      return;
    }
    
    audioRef.current = new Audio(preset.audioSrc);
    audioRef.current.loop = true;
    
    setSelectedPreset(preset);
    setCurrentTime(0);
    setFeedback(null);
    
    if (prompts[preset.id] && prompts[preset.id].length > 0) {
      setCurrentPrompt(prompts[preset.id][0]);
    }
  };

  const generateCustomMeditation = async () => {
    if (!customIntention.trim()) {
      toast.error("Please enter your intention for this meditation");
      return;
    }

    try {
      setIsGeneratingPrompts(true);
      
      // Generate meditation prompts using AI
      const aiPrompt = `Create 5 meditation prompts for a guided meditation with this intention: "${customIntention}". 
        Each prompt should be 1-2 sentences that guide the meditator through their practice. 
        Format as a simple array of strings, one for each moment in the meditation.`;
      
      const response = await getAIAnalysis(aiPrompt);
      
      try {
        // Try to parse the response as JSON
        let parsedPrompts: string[] = [];
        // First try to extract JSON if it's wrapped in text
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedPrompts = JSON.parse(jsonMatch[0]);
        } else {
          // If that fails, try to parse the whole response
          parsedPrompts = JSON.parse(response);
        }
        
        if (Array.isArray(parsedPrompts) && parsedPrompts.length > 0) {
          setCustomPrompts(parsedPrompts);
          prompts.custom = parsedPrompts;
        } else {
          throw new Error("Invalid format");
        }
      } catch (parseError) {
        // If parsing fails, split by newlines and clean up
        const fallbackPrompts = response
          .split(/\d+\.|\n\n|\n/)
          .map(line => line.trim())
          .filter(line => line.length > 10 && line.length < 200)
          .slice(0, 5);
          
        if (fallbackPrompts.length > 0) {
          setCustomPrompts(fallbackPrompts);
          prompts.custom = fallbackPrompts;
        } else {
          throw new Error("Could not parse meditation prompts");
        }
      }

      // Create custom meditation preset
      const customPreset = {
        ...MEDITATION_PRESETS.find(p => p.id === "custom")!,
        duration: customDuration,
        name: `Custom: ${customIntention.slice(0, 20)}${customIntention.length > 20 ? '...' : ''}`,
      };
      
      setSelectedPreset(customPreset);
      setCurrentTime(0);
      setFeedback(null);
      setCurrentPrompt(prompts.custom[0] || "Begin your meditation with deep, mindful breaths.");
      
      // Create audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(customPreset.audioSrc);
      audioRef.current.loop = true;
      
      setIsCustomDialogOpen(false);
      toast.success("Your personalized meditation is ready");
      
    } catch (error) {
      console.error("Failed to generate custom meditation:", error);
      toast.error("Failed to create custom meditation. Please try again.");
    } finally {
      setIsGeneratingPrompts(false);
    }
  };
  
  const startSession = () => {
    if (!selectedPreset) return;
    
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio:", err);
      });
    }
    
    intervalRef.current = window.setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = prevTime + 1;
        
        if (newTime % 60 === 0) {
          let promptsToUse = prompts[selectedPreset.id];
          if (!promptsToUse || promptsToUse.length === 0) {
            promptsToUse = prompts.calm; // Fallback
          }
          
          const promptIndex = Math.floor(newTime / 60) % promptsToUse.length;
          setCurrentPrompt(promptsToUse[promptIndex]);
        }
        
        if (newTime >= selectedPreset.duration) {
          endSession();
          return selectedPreset.duration;
        }
        
        return newTime;
      });
    }, 1000);
  };
  
  const pauseSession = () => {
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  const resumeSession = () => {
    if (!selectedPreset) return;
    
    setIsPlaying(true);
    
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Failed to play audio:", err);
      });
    }
    
    intervalRef.current = window.setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = prevTime + 1;
        
        if (newTime % 60 === 0) {
          let promptsToUse = prompts[selectedPreset.id];
          if (!promptsToUse || promptsToUse.length === 0) {
            promptsToUse = prompts.calm; // Fallback
          }
          
          const promptIndex = Math.floor(newTime / 60) % promptsToUse.length;
          setCurrentPrompt(promptsToUse[promptIndex]);
        }
        
        if (newTime >= selectedPreset.duration) {
          endSession();
          return selectedPreset.duration;
        }
        
        return newTime;
      });
    }, 1000);
  };
  
  const endSession = async () => {
    pauseSession();
    
    if (!selectedPreset) return;
    
    try {
      const result = await getAIAnalysis(
        `Generate a short, encouraging feedback message (2-3 sentences) for someone who just completed a ${selectedPreset.name} meditation session for ${Math.floor(selectedPreset.duration / 60)} minutes. Focus on the benefits they may be experiencing and encourage them to maintain a regular practice. Make it warm and supportive.`
      );
      
      setFeedback(result);
      toast.success("Meditation session completed!");
    } catch (error) {
      console.error("Failed to generate feedback:", error);
    }
  };
  
  const skipSession = () => {
    if (!selectedPreset) return;
    
    pauseSession();
    setCurrentTime(selectedPreset.duration);
    endSession();
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getProgressPercentage = (): number => {
    if (!selectedPreset) return 0;
    return (currentTime / selectedPreset.duration) * 100;
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Mindfulness Meditation</h2>
        <p className="text-muted-foreground">
          Guided meditation sessions to improve your mental wellbeing and mindfulness.
        </p>
      </div>
      
      {!selectedPreset ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MEDITATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className={`glass-card rounded-xl p-6 text-left transition-all duration-300 
                hover:shadow-lg hover:scale-[1.02] border 
                ${isDarkMode 
                  ? 'border-gray-800/40 hover:border-gray-700' 
                  : 'border-white/20 hover:border-white/40'
                } group`}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${preset.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {preset.icon}
              </div>
              
              <h3 className="text-lg font-medium mb-1">{preset.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{preset.description}</p>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {preset.id !== "custom" ? (
                  <span>{Math.floor(preset.duration / 60)} minutes</span>
                ) : (
                  <span>Customizable duration</span>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={`glass-card rounded-xl p-6 space-y-6 animate-scale-in border
          ${isDarkMode 
            ? 'border-violet-800/20 shadow-lg shadow-violet-900/10' 
            : 'border-reflectify-purple/10 shadow-lg shadow-reflectify-purple/5'
          }`}>
          {!feedback ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{selectedPreset.name}</h3>
                  <p className="text-sm text-muted-foreground">{Math.floor(selectedPreset.duration / 60)} min meditation</p>
                </div>
                
                <button 
                  onClick={() => setSelectedPreset(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change
                </button>
              </div>
              
              <div className="relative pt-10 pb-20">
                <div 
                  className={`absolute inset-0 flex items-center justify-center rounded-full ${
                    isPlaying ? 'animate-breathe' : ''
                  }`}
                >
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${selectedPreset.color} opacity-20`}></div>
                  <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-r ${selectedPreset.color} opacity-40`}></div>
                  <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-r ${selectedPreset.color} opacity-60`}></div>
                  <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-r ${selectedPreset.color} flex items-center justify-center text-white`}>
                    {formatTime(selectedPreset.duration - currentTime)}
                  </div>
                </div>
              </div>
              
              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`absolute h-full bg-gradient-to-r ${selectedPreset.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              
              <div className="text-center animate-fade-in min-h-[60px] flex items-center justify-center">
                <p className="italic text-foreground">{currentPrompt}</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                {isPlaying ? (
                  <Button
                    onClick={pauseSession}
                    className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pause className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={currentTime > 0 ? resumeSession : startSession}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-reflectify-blue to-reflectify-purple text-white"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                )}
                
                <Button
                  onClick={skipSession}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedPreset.color} flex items-center justify-center text-white`}>
                    {selectedPreset.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-2">Session Complete</h3>
                <p className="text-muted-foreground text-sm">
                  You've completed a {Math.floor(selectedPreset.duration / 60)} minute {selectedPreset.name} meditation
                </p>
              </div>
              
              <div className={`p-5 rounded-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-violet-900/10 to-indigo-900/10 border border-violet-800/20' 
                  : 'bg-gradient-to-r from-reflectify-purple/5 to-reflectify-teal/5 border border-reflectify-purple/10'
              }`}>
                <p className="text-foreground leading-relaxed">{feedback}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => selectPreset(selectedPreset)}
                  variant="outline"
                  className="w-full"
                >
                  Repeat Session
                </Button>
                
                <Button
                  onClick={() => setSelectedPreset(null)}
                  className="w-full bg-reflectify-blue hover:bg-reflectify-blue/90 text-white"
                >
                  Choose New Session
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Custom Meditation</DialogTitle>
            <DialogDescription>
              Tell us your intention and we'll create a personalized meditation experience for you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="intention">Meditation Intention</Label>
              <Textarea
                id="intention"
                placeholder="Examples: Reduce anxiety before a presentation, Find clarity in a difficult decision, Release tension in my body..."
                value={customIntention}
                onChange={(e) => setCustomIntention(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Duration (minutes)</Label>
                <span className="text-sm text-muted-foreground">{Math.floor(customDuration / 60)} minutes</span>
              </div>
              <Slider 
                defaultValue={[customDuration / 60]} 
                max={20} 
                min={1} 
                step={1}
                onValueChange={(values) => setCustomDuration(values[0] * 60)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={generateCustomMeditation}
              disabled={isGeneratingPrompts || !customIntention}
              className="bg-gradient-to-r from-reflectify-blue to-reflectify-purple text-white"
            >
              {isGeneratingPrompts ? "Creating..." : "Create Meditation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindfulnessSession;
