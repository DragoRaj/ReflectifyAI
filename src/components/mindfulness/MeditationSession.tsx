
import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { MeditationPreset } from "./types";
import { MEDITATION_PROMPTS } from "./MeditationPresets";

interface MeditationSessionProps {
  preset: MeditationPreset;
  onComplete: () => void;
  onChangePreset: () => void;
  feedback: string | null;
  setFeedback: (feedback: string | null) => void;
}

const MeditationSession = ({
  preset,
  onComplete,
  onChangePreset,
  feedback,
  setFeedback
}: MeditationSessionProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  
  const { isDarkMode } = useTheme();
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(preset.audioSrc);
    audioRef.current.loop = true;
    
    let promptsToUse = MEDITATION_PROMPTS[preset.id];
    if (!promptsToUse || promptsToUse.length === 0) {
      promptsToUse = MEDITATION_PROMPTS.calm; // Fallback
    }
    
    setCurrentPrompt(promptsToUse[0]);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [preset]);
  
  const startSession = () => {
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
          let promptsToUse = MEDITATION_PROMPTS[preset.id];
          if (!promptsToUse || promptsToUse.length === 0) {
            promptsToUse = MEDITATION_PROMPTS.calm; // Fallback
          }
          
          const promptIndex = Math.floor(newTime / 60) % promptsToUse.length;
          setCurrentPrompt(promptsToUse[promptIndex]);
        }
        
        if (newTime >= preset.duration) {
          endSession();
          return preset.duration;
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
          let promptsToUse = MEDITATION_PROMPTS[preset.id];
          if (!promptsToUse || promptsToUse.length === 0) {
            promptsToUse = MEDITATION_PROMPTS.calm; // Fallback
          }
          
          const promptIndex = Math.floor(newTime / 60) % promptsToUse.length;
          setCurrentPrompt(promptsToUse[promptIndex]);
        }
        
        if (newTime >= preset.duration) {
          endSession();
          return preset.duration;
        }
        
        return newTime;
      });
    }, 1000);
  };
  
  const endSession = () => {
    pauseSession();
    onComplete();
  };
  
  const skipSession = () => {
    pauseSession();
    setCurrentTime(preset.duration);
    endSession();
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getProgressPercentage = (): number => {
    return (currentTime / preset.duration) * 100;
  };

  if (feedback) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${preset.color} flex items-center justify-center text-white`}>
              {preset.icon}
            </div>
          </div>
          
          <h3 className="text-xl font-medium mb-2">Session Complete</h3>
          <p className="text-muted-foreground text-sm">
            You've completed a {Math.floor(preset.duration / 60)} minute {preset.name} meditation
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
            onClick={onChangePreset}
            variant="outline"
            className="w-full"
          >
            Repeat Session
          </Button>
          
          <Button
            onClick={() => {
              setFeedback(null);
              onChangePreset();
            }}
            className="w-full bg-reflectify-blue hover:bg-reflectify-blue/90 text-white"
          >
            Choose New Session
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{preset.name}</h3>
          <p className="text-sm text-muted-foreground">{Math.floor(preset.duration / 60)} min meditation</p>
        </div>
        
        <button 
          onClick={onChangePreset}
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
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${preset.color} opacity-20`}></div>
          <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-r ${preset.color} opacity-40`}></div>
          <div className={`absolute w-24 h-24 rounded-full bg-gradient-to-r ${preset.color} opacity-60`}></div>
          <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-r ${preset.color} flex items-center justify-center text-white`}>
            {formatTime(preset.duration - currentTime)}
          </div>
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`absolute h-full bg-gradient-to-r ${preset.color} rounded-full transition-all duration-1000`}
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
  );
};

export default MeditationSession;
