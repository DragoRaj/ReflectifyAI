
import { useTheme } from "@/components/ThemeProvider";
import { MeditationPreset } from "./types";
import { Clock } from "lucide-react";

interface MeditationSelectorProps {
  presets: MeditationPreset[];
  onSelect: (preset: MeditationPreset) => void;
}

const MeditationSelector = ({ presets, onSelect }: MeditationSelectorProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset)}
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
  );
};

export default MeditationSelector;
