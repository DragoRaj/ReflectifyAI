
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HealthAnalysis from "@/components/HealthAnalysis";
import MindfulnessSession from "@/components/MindfulnessSession";
import Journal from "@/components/Journal";
import FunctionalAnalytics from "@/components/FunctionalAnalytics";
import { 
  Send, 
  Trash, 
  MessageCircle, 
  HeartPulse, 
  BookText, 
  Shield, 
  Frown, 
  Meh, 
  Smile, 
  Sparkles,
  Copy,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  PartyPopper,
  Heart,
  Coffee,
  Angry,
  Leaf,
  ArrowDown,
  BarChart2
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { analyzeContent, getAIAnalysis } from "@/utils/aiUtils";

type FeatureTab = "rant" | "chat" | "journal" | "content" | "health" | "mindfulness" | "analytics" | "home";
type Mood = "happy" | "neutral" | "sad" | "excited" | "loving" | "calm" | "angry" | "peaceful" | null;

const trackFeatureUsage = (feature: string, value: number = 1) => {
  const currentCount = parseInt(localStorage.getItem(`${feature}Count`) || '0');
  localStorage.setItem(`${feature}Count`, String(currentCount + value));
  
  if (!localStorage.getItem('appStartDate')) {
    localStorage.setItem('appStartDate', new Date().toISOString());
  }
  
  localStorage.setItem(`${feature}LastUsed`, new Date().toISOString());
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>("content");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  useEffect(() => {
    setIsPageLoaded(true);

    const hash = window.location.hash.substring(1);
    if (hash && ["content", "chat", "rant", "journal", "health", "mindfulness", "analytics", "home"].includes(hash)) {
      setActiveTab(hash as FeatureTab);
    }
    
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail.tab as FeatureTab);
    };
    
    window.addEventListener('tabChange', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('tabChange', handleTabChange as EventListener);
    };
  }, []);
  
  const [rantText, setRantText] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [mood, setMood] = useState<Mood>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "ai"; content: string}[]>([]);
  
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<null | {
    toxicity: number;
    insult: number;
    profanity: number;
    identity_attack: number;
    threat: number;
    overall: "safe" | "caution" | "toxic";
    summary: string;
  }>(null);
  
  // Track journal visits at the component level, not in the render function
  useEffect(() => {
    if (activeTab === "journal") {
      trackFeatureUsage('journalVisit');
    }
  }, [activeTab]);
  
  const handleRantSubmit = async () => {
    if (!rantText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const aiResponseText = await getAIAnalysis(
        `The user is sharing their feelings with you. They said: "${rantText}"
        
        Provide a supportive, empathetic, and helpful response focused on emotional wellbeing. Be compassionate but not clinical. 
        Aim for about 3-4 sentences that acknowledge their feelings, offer perspective, and provide a gentle suggestion if appropriate.
        Do not use obvious templates or introduce yourself. Just respond naturally as a caring friend would.`
      );
      
      setResponse(aiResponseText);
      
      trackFeatureUsage('expressInteraction');
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const clearRant = () => {
    setRantText("");
    setResponse(null);
  };
  
  const selectMood = (selectedMood: Mood) => {
    setMood(selectedMood);
    
    const initialMessage = {
      role: "ai" as const,
      content: getMoodWelcomeMessage(selectedMood)
    };
    
    setMessages([initialMessage]);
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    
    const moodValue = {
      "happy": 5,
      "excited": 5,
      "loving": 4,
      "neutral": 3,
      "calm": 4,
      "peaceful": 4,
      "sad": 2,
      "angry": 1
    }[selectedMood || "neutral"] || 3;
    
    const moodEntriesStr = localStorage.getItem('moodEntries');
    const moodEntries = moodEntriesStr ? JSON.parse(moodEntriesStr) : [];
    
    moodEntries.push({
      date: formattedDate,
      mood: selectedMood,
      value: moodValue
    });
    
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  };
  
  const getMoodWelcomeMessage = (selectedMood: Mood): string => {
    switch (selectedMood) {
      case "happy":
        return "It's wonderful to hear you're feeling good today! What's contributing to your happiness? Let's explore those positive feelings together.";
      case "excited":
        return "You're feeling excited! That's fantastic energy to harness. What's got you feeling so enthusiastic today?";
      case "loving":
        return "That warm, loving feeling is one of life's greatest treasures. Would you like to talk about what's inspiring these feelings of connection and love?";
      case "neutral":
        return "You're feeling balanced today. That's a good state to be in. Would you like to talk about maintaining this equilibrium or anything else on your mind?";
      case "calm":
        return "A calm mind is a powerful foundation for wellbeing. What's helping you feel this sense of tranquility today?";
      case "peaceful":
        return "Peace of mind is truly valuable. What's contributing to your sense of peace today? I'd love to hear more about it.";
      case "sad":
        return "I'm sorry to hear you're feeling down. It takes courage to acknowledge these feelings. Would you like to talk about what's on your mind, or perhaps I could share some encouraging thoughts?";
      case "angry":
        return "I understand you're feeling angry right now. That's a natural emotion that deserves acknowledgment. Would you like to talk about what's triggering these feelings?";
      default:
        return "Hello! How are you feeling today?";
    }
  };
  
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !mood) return;
    
    const userMessage = { role: "user" as const, content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsProcessing(true);
    
    const conversationContext = messages.map(msg => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`).join("\n");
    
    try {
      const aiResponseText = await getAIAnalysis(
        `You are an AI wellbeing assistant having a conversation with a user who is currently feeling ${mood}.
        
        Previous conversation:
        ${conversationContext}
        
        User's new message: "${chatInput}"
        
        Respond in a way that is supportive, empathetic, and tailored to their current mood of ${mood}.
        For happy moods: Celebrate with them and help them savor the positive emotions.
        For excited moods: Match their enthusiasm and help channel that energy positively.
        For loving moods: Acknowledge the beauty of connection and love, helping them appreciate these feelings.
        For neutral moods: Provide balanced perspective and gentle guidance.
        For calm moods: Reinforce the value of this tranquil state and how to maintain it.
        For peaceful moods: Acknowledge the wisdom in finding peace and help them explore what brings them to this state.
        For sad moods: Show compassion, validation, and gentle suggestions for feeling better.
        For angry moods: Validate their feelings while gently helping them process and navigate the emotion constructively.
        
        Keep your response conversational, helpful, and focused on wellbeing. Don't use obvious templates or introduce yourself - this is an ongoing conversation.`
      );
      
      const aiMessage = { role: "ai" as const, content: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
      
      trackFeatureUsage('chatInteraction');
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetChat = () => {
    setMood(null);
    setChatInput("");
    setMessages([]);
  };
  
  const getMoodIcon = (currentMood: Mood) => {
    switch (currentMood) {
      case "happy":
        return <Smile className="h-6 w-6 text-reflectify-teal" />;
      case "excited":
        return <PartyPopper className="h-6 w-6 text-amber-500" />;
      case "loving":
        return <Heart className="h-6 w-6 text-rose-500" />;
      case "neutral":
        return <Meh className="h-6 w-6 text-reflectify-blue" />;
      case "calm":
        return <Coffee className="h-6 w-6 text-amber-700" />;
      case "peaceful":
        return <Leaf className="h-6 w-6 text-emerald-500" />;
      case "sad":
        return <Frown className="h-6 w-6 text-reflectify-purple" />;
      case "angry":
        return <Angry className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getMoodColor = (currentMood: Mood): string => {
    switch (currentMood) {
      case "happy": return "from-reflectify-teal to-green-400";
      case "excited": return "from-amber-500 to-yellow-300";
      case "loving": return "from-rose-500 to-pink-300";
      case "neutral": return "from-reflectify-blue to-blue-400";
      case "calm": return "from-amber-700 to-amber-500";
      case "peaceful": return "from-emerald-500 to-emerald-300";
      case "sad": return "from-reflectify-purple to-purple-400";
      case "angry": return "from-red-500 to-red-400";
      default: return "from-gray-400 to-gray-300";
    }
  };
  
  const getMoodBorderColor = (currentMood: Mood): string => {
    switch (currentMood) {
      case "happy": return "border-reflectify-teal/20";
      case "excited": return "border-amber-500/20";
      case "loving": return "border-rose-500/20";
      case "neutral": return "border-reflectify-blue/20";
      case "calm": return "border-amber-700/20";
      case "peaceful": return "border-emerald-500/20";
      case "sad": return "border-reflectify-purple/20";
      case "angry": return "border-red-500/20";
      default: return "border-gray-400/20";
    }
  };
  
  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      toast.error("Please enter some content to analyze");
      return;
    }

    setIsProcessing(true);

    try {
      const analysisResult = await analyzeContent(content);
      
      if (analysisResult) {
        setAnalysis(analysisResult);
        
        trackFeatureUsage('contentAnalysis');
      } else {
        throw new Error("Could not parse analysis result");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score < 0.3) return "text-reflectify-teal";
    if (score < 0.6) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreBackground = (score: number) => {
    if (score < 0.3) return "bg-reflectify-teal/10";
    if (score < 0.6) return "bg-yellow-500/10";
    return "bg-destructive/10";
  };

  const getOverallStatusDisplay = () => {
    if (!analysis) return null;
    
    switch (analysis.overall) {
      case "safe":
        return (
          <div className="flex items-center gap-2 text-reflectify-teal font-medium">
            <CheckCircle className="h-5 w-5" />
            <span>Safe Content</span>
          </div>
        );
      case "caution":
        return (
          <div className="flex items-center gap-2 text-yellow-500 font-medium">
            <AlertTriangle className="h-5 w-5" />
            <span>Use Caution</span>
          </div>
        );
      case "toxic":
        return (
          <div className="flex items-center gap-2 text-destructive font-medium">
            <Shield className="h-5 w-5" />
            <span>Potentially Harmful</span>
          </div>
        );
      default:
        return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };
  
  const renderRantMode = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Express Yourself</h2>
        <p className="text-muted-foreground">
          Share your thoughts and feelings. Receive supportive AI guidance focused on your wellbeing.
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
        <Textarea
          value={rantText}
          onChange={(e) => setRantText(e.target.value)}
          placeholder="How are you feeling today? Type your thoughts..."
          className="min-h-[200px] bg-transparent border-0 focus-visible:ring-0 resize-none p-2 outline-none text-lg"
        />
        
        <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
          <button
            onClick={clearRant}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Clear text"
          >
            <Trash className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleRantSubmit}
            disabled={!rantText.trim() || isProcessing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              !rantText.trim() || isProcessing
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "reflectify-button"
            }`}
          >
            {isProcessing ? "Processing..." : "Get Feedback"}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {response && (
        <div className="glass-card rounded-xl p-6 animate-scale-in space-y-4 border border-reflectify-purple/10 shadow-lg shadow-reflectify-purple/5 transition-all duration-300 hover:border-reflectify-purple/20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-reflectify-purple to-reflectify-blue p-2 rounded-full text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display font-medium">AI Response</h3>
          </div>
          
          <p className="text-foreground leading-relaxed">{response}</p>
          
          <div className="flex justify-end pt-2">
            <button
              onClick={clearRant}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderWellbeingChat = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Wellbeing Chat</h2>
        <p className="text-muted-foreground">
          Chat with an AI companion that adapts to your mood and helps you navigate your emotions.
        </p>
      </div>
      
      {!mood ? (
        <div className="glass-card rounded-xl p-6 text-center space-y-8 border border-reflectify-purple/10 shadow-lg shadow-reflectify-purple/5">
          <h3 className="text-xl font-display font-medium">How are you feeling today?</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-center">
            <button
              onClick={() => selectMood("happy")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-reflectify-teal/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-reflectify-teal to-green-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Smile className="h-7 w-7" />
              </div>
              <span className="font-medium">Happy</span>
            </button>
            
            <button
              onClick={() => selectMood("excited")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-amber-500/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-white group-hover:scale-110 transition-transform duration-300">
                <PartyPopper className="h-7 w-7" />
              </div>
              <span className="font-medium">Excited</span>
            </button>
            
            <button
              onClick={() => selectMood("loving")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-rose-500/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-300 text-white group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-7 w-7" />
              </div>
              <span className="font-medium">Loving</span>
            </button>
            
            <button
              onClick={() => selectMood("neutral")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-reflectify-blue/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-reflectify-blue to-blue-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Meh className="h-7 w-7" />
              </div>
              <span className="font-medium">Neutral</span>
            </button>
            
            <button
              onClick={() => selectMood("calm")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-amber-700/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-700 to-amber-500 text-white group-hover:scale-110 transition-transform duration-300">
                <Coffee className="h-7 w-7" />
              </div>
              <span className="font-medium">Calm</span>
            </button>
            
            <button
              onClick={() => selectMood("peaceful")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-emerald-500/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 text-white group-hover:scale-110 transition-transform duration-300">
                <Leaf className="h-7 w-7" />
              </div>
              <span className="font-medium">Peaceful</span>
            </button>
            
            <button
              onClick={() => selectMood("sad")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-reflectify-purple/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-reflectify-purple to-purple-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Frown className="h-7 w-7" />
              </div>
              <span className="font-medium">Sad</span>
            </button>
            
            <button
              onClick={() => selectMood("angry")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-red-500/20 group hover:-translate-y-1"
            >
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Angry className="h-7 w-7" />
              </div>
              <span className="font-medium">Angry</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 flex flex-col h-[500px] border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              {getMoodIcon(mood)}
              <span className="font-medium capitalize">{mood} Mood</span>
            </div>
            
            <button
              onClick={resetChat}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reset Chat
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 ${
                    message.role === "user"
                      ? `bg-gradient-to-r ${getMoodColor(mood)} text-white`
                      : "bg-white dark:bg-gray-800 text-foreground shadow-sm"
                  }`}
                >
                  {message.role === "ai" && (
                    <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3" />
                      <span>AI Companion</span>
                    </div>
                  )}
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 flex gap-1 shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-reflectify-blue/60"></div>
                  <div className="h-2 w-2 rounded-full bg-reflectify-blue/60 animate-pulse delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-reflectify-blue/60 animate-pulse delay-200"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-gray-800 rounded-full px-4 py-2.5 text-foreground border-none focus:ring-1 focus:ring-reflectify-blue outline-none transition-all duration-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
              />
              
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || isProcessing}
                className={`p-3 rounded-full transition-all ${
                  !chatInput.trim() || isProcessing
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : `bg-gradient-to-r ${getMoodColor(mood)} text-white hover:shadow-md`
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContentAnalysis = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight flex items-center gap-2">
          <Shield className="h-5 w-5 text-reflectify-blue" />
          Content Analysis
        </h2>
        <p className="text-muted-foreground">
          Analyze social media posts or any text for appropriateness and toxicity.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:border-reflectify-blue/20">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste a social media post, comment, or any text you want to analyze..."
          className="min-h-[150px] bg-transparent border-0 focus-visible:ring-0 resize-none p-2 outline-none"
        />
        
        <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleAnalyzeContent}
            disabled={!content.trim() || isProcessing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              !content.trim() || isProcessing
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "reflectify-button"
            }`}
          >
            {isProcessing ? "Analyzing..." : "Analyze Content"}
            <Shield className="h-4 w-4" />
          </button>
        </div>
      </div>

      {analysis && (
        <div className="glass-card rounded-xl p-6 space-y-5 animate-scale-in transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-medium">Analysis Results</h3>
            {getOverallStatusDisplay()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.toxicity)} transition-colors duration-300 hover:shadow-md`}>
              <p className="text-sm text-muted-foreground mb-1">Toxicity</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.toxicity)}`}>
                {(analysis.toxicity * 100).toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${analysis.toxicity < 0.3 ? 'bg-reflectify-teal' : analysis.toxicity < 0.6 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                  style={{ width: `${analysis.toxicity * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.insult)} transition-colors duration-300 hover:shadow-md`}>
              <p className="text-sm text-muted-foreground mb-1">Insult</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.insult)}`}>
                {(analysis.insult * 100).toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${analysis.insult < 0.3 ? 'bg-reflectify-teal' : analysis.insult < 0.6 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                  style={{ width: `${analysis.insult * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.profanity)} transition-colors duration-300 hover:shadow-md`}>
              <p className="text-sm text-muted-foreground mb-1">Profanity</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.profanity)}`}>
                {(analysis.profanity * 100).toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${analysis.profanity < 0.3 ? 'bg-reflectify-teal' : analysis.profanity < 0.6 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                  style={{ width: `${analysis.profanity * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.identity_attack)} transition-colors duration-300 hover:shadow-md`}>
              <p className="text-sm text-muted-foreground mb-1">Identity Attack</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.identity_attack)}`}>
                {(analysis.identity_attack * 100).toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${analysis.identity_attack < 0.3 ? 'bg-reflectify-teal' : analysis.identity_attack < 0.6 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                  style={{ width: `${analysis.identity_attack * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.threat)} transition-colors duration-300 hover:shadow-md`}>
              <p className="text-sm text-muted-foreground mb-1">Threat</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.threat)}`}>
                {(analysis.threat * 100).toFixed(0)}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${analysis.threat < 0.3 ? 'bg-reflectify-teal' : analysis.threat < 0.6 ? 'bg-yellow-500' : 'bg-destructive'}`} 
                  style={{ width: `${analysis.threat * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-border transition-all duration-300 hover:border-reflectify-blue/20">
            <h4 className="font-medium mb-2">Summary</h4>
            <p className="text-foreground">{analysis.summary}</p>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>This analysis is performed using AI and may not be 100% accurate. Use your judgment when making decisions based on these results.</p>
            <a 
              href="https://ai.google.dev/responsible-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-reflectify-blue inline-flex items-center gap-1 mt-1 hover:underline"
            >
              Learn about responsible AI <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
  
  // Fixed: Removed the useEffect hook from inside this render function
  const renderJournal = () => <Journal />;
  
  const renderAnalytics = () => <FunctionalAnalytics />;
  
  const renderFeatureContent = () => {
    switch (activeTab) {
      case "rant":
        return renderRantMode();
      case "chat":
        return renderWellbeingChat();
      case "journal":
        return renderJournal();
      case "content":
        return renderContentAnalysis();
      case "health":
        return <HealthAnalysis />;
      case "mindfulness":
        return <MindfulnessSession />;
      case "analytics":
        return renderAnalytics();
      case "home":
      default:
        return (
          <div className="text-center py-12 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight reflectify-gradient-text animate-float">
              Welcome to Reflectify
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Express your thoughts, track your health, and maintain your mental wellbeing with personalized AI guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => setActiveTab("content")}
                className="reflectify-button"
              >
                Get Started
              </button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <section className="min-h-[40vh] flex flex-col justify-center py-6 px-4 animate-fade-in">
          <div className={`text-center space-y-6 max-w-3xl mx-auto transition-all duration-1000 ${isPageLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center p-1.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-400/10 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium reflectify-gradient-text px-3 py-1">
                AI-Powered Health & Wellbeing
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight reflectify-gradient-text animate-float">
              Reflectify
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Express your thoughts, track your health, and maintain your mental wellbeing with personalized AI guidance.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => setActiveTab("content")}
                className="reflectify-button"
              >
                Get Started
              </button>
              
              <button 
                onClick={() => setActiveTab("analytics")}
                className="px-4 py-2 rounded-full border border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300 font-medium transition-all duration-300 hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
              >
                View Analytics
              </button>
            </div>
          </div>
        </section>
        
        <section id="features-section" className="py-16 px-4">
          <div className="min-h-[70vh] flex justify-center">
            {renderFeatureContent()}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
