
import React, { useState } from 'react';
import { Terminal, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DevControlsProps {
  className?: string;
}

const DevControls: React.FC<DevControlsProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{type: 'command' | 'response', content: string}[]>([]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: command }]);
    
    // Process the command
    const response = processCommand(command);
    
    // Add response to history
    setHistory(prev => [...prev, { type: 'response', content: response }]);
    
    // Clear input
    setCommand('');
  };

  const processCommand = (cmd: string): string => {
    const lowerCmd = cmd.toLowerCase().trim();
    
    // Handle splash screen override commands
    if (lowerCmd.startsWith('splash')) {
      const params = lowerCmd.split(' ');
      
      if (params.length < 2) {
        return "Error: Invalid splash command. Try 'splash show' or 'splash type [initial|feature]'";
      }
      
      const action = params[1];
      
      if (action === 'show') {
        // Force show the main splash screen
        localStorage.removeItem('initialLoadComplete');
        sessionStorage.removeItem('initialLoadComplete');
        toast.success("Main splash screen will show on next reload");
        return "Success: Main splash screen will show on next reload. Reload the page to see it.";
      }
      
      if (action === 'type') {
        if (params.length < 3) {
          return "Error: Missing splash type. Try 'splash type initial' or 'splash type feature'";
        }
        
        const type = params[2];
        
        if (type === 'initial') {
          localStorage.setItem('overrideSplashType', 'initial');
          toast.success("Initial splash screen type set");
          return "Success: Initial splash screen type set. Reload the page to see it.";
        }
        
        if (type === 'feature') {
          localStorage.setItem('overrideSplashType', 'feature');
          toast.success("Feature splash screen type set");
          return "Success: Feature splash screen type set. Use 'splash feature [name]' to set specific feature.";
        }
        
        return `Error: Unknown splash type '${type}'. Try 'initial' or 'feature'.`;
      }
      
      if (action === 'feature' && params.length >= 3) {
        const featureName = params[2];
        const validFeatures = ['home', 'analytics', 'content', 'chat', 'rant', 'mindfulness', 'journal', 'health'];
        
        if (validFeatures.includes(featureName)) {
          localStorage.setItem('overrideFeatureSplash', featureName);
          localStorage.setItem('overrideSplashType', 'feature');
          window.location.hash = featureName;
          toast.success(`Feature splash for '${featureName}' will show on next navigation`);
          return `Success: Feature splash for '${featureName}' will show on next navigation.`;
        }
        
        return `Error: Unknown feature '${featureName}'. Valid features: ${validFeatures.join(', ')}`;
      }
      
      return `Error: Unknown splash command '${action}'.`;
    }
    
    // Handle experience level override
    if (lowerCmd.startsWith('experience')) {
      const params = lowerCmd.split(' ');
      
      if (params.length < 3) {
        return "Error: Invalid experience command. Try 'experience set [new|regular|advanced]'";
      }
      
      if (params[1] === 'set') {
        const level = params[2];
        
        if (level === 'new' || level === 'beginner') {
          localStorage.setItem('expressInteractionCount', '0');
          localStorage.setItem('chatInteractionCount', '0');
          localStorage.setItem('contentAnalysisCount', '0');
          localStorage.setItem('journalVisitCount', '0');
          localStorage.setItem('appStartDate', new Date().toISOString());
          toast.success("User experience level set to new/beginner");
          return "Success: User experience level set to new/beginner.";
        }
        
        if (level === 'regular') {
          localStorage.setItem('expressInteractionCount', '15');
          localStorage.setItem('chatInteractionCount', '10');
          localStorage.setItem('contentAnalysisCount', '8');
          localStorage.setItem('journalVisitCount', '5');
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          localStorage.setItem('appStartDate', sevenDaysAgo.toISOString());
          toast.success("User experience level set to regular");
          return "Success: User experience level set to regular (7 days of usage).";
        }
        
        if (level === 'advanced') {
          localStorage.setItem('expressInteractionCount', '50');
          localStorage.setItem('chatInteractionCount', '45');
          localStorage.setItem('contentAnalysisCount', '30');
          localStorage.setItem('journalVisitCount', '25');
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          localStorage.setItem('appStartDate', thirtyDaysAgo.toISOString());
          toast.success("User experience level set to advanced");
          return "Success: User experience level set to advanced (30 days of usage).";
        }
        
        return `Error: Unknown experience level '${level}'. Try 'new', 'regular', or 'advanced'.`;
      }
      
      return "Error: Invalid experience command. Try 'experience set [new|regular|advanced]'";
    }
    
    // Handle theme override
    if (lowerCmd.startsWith('theme')) {
      const params = lowerCmd.split(' ');
      
      if (params.length < 3) {
        return "Error: Invalid theme command. Try 'theme set [name]' or 'theme mode [dark|light]'";
      }
      
      if (params[1] === 'set') {
        const themeName = params[2];
        const validThemes = ['blue', 'purple', 'teal', 'pink', 'amber', 'green', 'crimson', 'indigo', 'emerald', 'violet', 'coral', 'cyan'];
        
        if (validThemes.includes(themeName)) {
          localStorage.setItem('colorTheme', themeName);
          document.documentElement.setAttribute('data-theme', themeName);
          
          // Apply theme colors based on SwitchThemer.tsx logic
          const themeObj = {
            blue: { h: 221, s: 83, l: 53 },
            purple: { h: 250, s: 83, l: 53 },
            teal: { h: 171, s: 83, l: 45 },
            pink: { h: 330, s: 80, l: 60 },
            amber: { h: 43, s: 96, l: 58 },
            green: { h: 142, s: 72, l: 50 },
            crimson: { h: 348, s: 83, l: 47 },
            indigo: { h: 263, s: 70, l: 50 },
            emerald: { h: 152, s: 69, l: 40 },
            violet: { h: 270, s: 76, l: 60 },
            coral: { h: 16, s: 85, l: 64 },
            cyan: { h: 187, s: 72, l: 47 }
          }[themeName];
          
          if (themeObj) {
            document.documentElement.style.setProperty('--theme-text', `${themeObj.h} ${themeObj.s}% ${themeObj.l}%`);
            document.documentElement.style.setProperty('--theme-icon', `${themeObj.h} ${themeObj.s}% ${themeObj.l}%`);
            document.documentElement.style.setProperty('--theme-color', `${themeObj.h} ${themeObj.s}% ${themeObj.l}%`);
            document.documentElement.style.setProperty('--theme-color-darker', `${themeObj.h} ${themeObj.s}% ${Math.max(themeObj.l - 10, 5)}%`);
          }
          
          toast.success(`Theme set to '${themeName}'`);
          return `Success: Theme set to '${themeName}'.`;
        }
        
        return `Error: Unknown theme '${themeName}'. Valid themes: ${validThemes.join(', ')}`;
      }
      
      if (params[1] === 'mode') {
        const mode = params[2].toLowerCase();
        
        if (mode === 'dark') {
          localStorage.setItem('darkMode', 'true');
          document.documentElement.classList.add('dark');
          toast.success("Dark mode activated");
          return "Success: Dark mode activated.";
        }
        
        if (mode === 'light') {
          localStorage.setItem('darkMode', 'false');
          document.documentElement.classList.remove('dark');
          toast.success("Light mode activated");
          return "Success: Light mode activated.";
        }
        
        return `Error: Unknown mode '${mode}'. Try 'dark' or 'light'.`;
      }
      
      return `Error: Unknown theme command '${params[1]}'.`;
    }
    
    if (lowerCmd === 'help') {
      return `
Available commands:

splash show - Force show the main splash screen on next reload
splash type [initial|feature] - Set the type of splash screen to show
splash feature [name] - Show splash for specific feature (home, analytics, content, chat, rant, mindfulness, journal, health)

experience set [new|regular|advanced] - Override user experience level

theme set [name] - Set theme color (blue, purple, teal, pink, amber, green, crimson, indigo, emerald, violet, coral, cyan)
theme mode [dark|light] - Set dark or light mode

reload - Reload the page
clear - Clear command history
help - Show this help message
      `;
    }
    
    if (lowerCmd === 'clear') {
      setHistory([]);
      return "";
    }
    
    if (lowerCmd === 'reload') {
      window.location.reload();
      return "Reloading...";
    }
    
    return `Unknown command: ${cmd}. Type 'help' for available commands.`;
  };

  return (
    <div className={`fixed bottom-0 right-0 z-50 ${className || ''}`}>
      {isOpen ? (
        <div className="w-80 h-64 bg-white dark:bg-gray-800 rounded-tl-lg shadow-lg border border-border flex flex-col">
          <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[hsl(var(--theme-icon))]" />
              <span className="text-sm font-medium">Developer Console</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleOpen} className="h-6 w-6">
              <X size={14} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 text-xs space-y-2 font-mono">
            {history.length === 0 && (
              <div className="text-muted-foreground italic">
                Type 'help' for available commands
              </div>
            )}
            
            {history.map((entry, i) => (
              <div key={i} className={`${entry.type === 'response' ? 'text-muted-foreground' : 'text-foreground'}`}>
                {entry.type === 'command' ? (
                  <div className="flex items-start gap-1">
                    <span className="text-[hsl(var(--theme-icon))]">$</span>
                    <span>{entry.content}</span>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap pl-4">{entry.content}</pre>
                )}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleCommandSubmit} className="border-t border-border p-2">
            <div className="flex items-center gap-2">
              <span className="text-[hsl(var(--theme-icon))]">$</span>
              <input
                type="text"
                value={command}
                onChange={e => setCommand(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs font-mono focus:outline-none focus:ring-0"
                placeholder="Enter command..."
                autoFocus
              />
            </div>
          </form>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleOpen} 
          className="rounded-tl-lg rounded-tr-lg rounded-br-none rounded-bl-none border-b-0 bg-secondary/50"
        >
          <Terminal size={14} className="mr-1 text-[hsl(var(--theme-icon))]" />
          <span className="text-xs">Dev Console</span>
        </Button>
      )}
    </div>
  );
};

export default DevControls;
