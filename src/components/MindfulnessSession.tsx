
import { useState } from "react";
import { toast } from "sonner";
import { getAIAnalysis } from "@/utils/aiUtils";
import { useTheme } from "@/components/ThemeProvider";
import { MeditationPreset } from "./mindfulness/types";
import { MEDITATION_PRESETS, MEDITATION_PROMPTS } from "./mindfulness/MeditationPresets";
import MeditationSelector from "./mindfulness/MeditationSelector";
import MeditationSession from "./mindfulness/MeditationSession";
import CustomMeditationDialog from "./mindfulness/CustomMeditationDialog";

const MindfulnessSession = () => {
  const [selectedPreset, setSelectedPreset] = useState<MeditationPreset | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState<number>(300); // Default 5 minutes
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState<boolean>(false);
  const [customIntention, setCustomIntention] = useState<string>("");
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState<boolean>(false);
  
  const { isDarkMode } = useTheme();
  
  const selectPreset = (preset: MeditationPreset) => {
    if (preset.id === "custom") {
      setIsCustomDialogOpen(true);
      return;
    }
    
    setSelectedPreset(preset);
    setFeedback(null);
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
          MEDITATION_PROMPTS.custom = parsedPrompts;
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
          MEDITATION_PROMPTS.custom = fallbackPrompts;
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
      setFeedback(null);
      setIsCustomDialogOpen(false);
      toast.success("Your personalized meditation is ready");
      
    } catch (error) {
      console.error("Failed to generate custom meditation:", error);
      toast.error("Failed to create custom meditation. Please try again.");
    } finally {
      setIsGeneratingPrompts(false);
    }
  };
  
  const completeSession = async () => {
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
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Mindfulness Meditation</h2>
        <p className="text-muted-foreground">
          Guided meditation sessions to improve your mental wellbeing and mindfulness.
        </p>
      </div>
      
      {!selectedPreset ? (
        <MeditationSelector 
          presets={MEDITATION_PRESETS} 
          onSelect={selectPreset} 
        />
      ) : (
        <div className={`glass-card rounded-xl p-6 space-y-6 animate-scale-in border
          ${isDarkMode 
            ? 'border-violet-800/20 shadow-lg shadow-violet-900/10' 
            : 'border-reflectify-purple/10 shadow-lg shadow-reflectify-purple/5'
          }`}>
          <MeditationSession 
            preset={selectedPreset}
            onComplete={completeSession}
            onChangePreset={() => setSelectedPreset(null)}
            feedback={feedback}
            setFeedback={setFeedback}
          />
        </div>
      )}
      
      <CustomMeditationDialog 
        open={isCustomDialogOpen}
        onOpenChange={setIsCustomDialogOpen}
        customDuration={customDuration}
        setCustomDuration={setCustomDuration}
        customIntention={customIntention}
        setCustomIntention={setCustomIntention}
        onGenerate={generateCustomMeditation}
        isGenerating={isGeneratingPrompts}
      />
    </div>
  );
};

export default MindfulnessSession;
