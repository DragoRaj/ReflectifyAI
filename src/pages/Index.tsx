
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HealthAnalysis from "@/components/HealthAnalysis";
import MindfulnessSession from "@/components/MindfulnessSession";
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
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { analyzeContent, getAIAnalysis } from "@/utils/aiUtils";

type FeatureTab = "rant" | "chat" | "journal" | "content" | "health" | "mindfulness";
type Mood = "happy" | "neutral" | "sad" | null;

const Index = () => {
  const [activeTab, setActiveTab] = useState<FeatureTab>("rant");
  
  // Rant Mode State
  const [rantText, setRantText] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Wellbeing Chat State
  const [mood, setMood] = useState<Mood>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "ai"; content: string}[]>([]);
  
  // Content Analysis State
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
  
  // === RANT MODE FUNCTIONS ===
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
  
  // === WELLBEING CHAT FUNCTIONS ===
  const selectMood = (selectedMood: Mood) => {
    setMood(selectedMood);
    
    const initialMessage = {
      role: "ai" as const,
      content: getMoodWelcomeMessage(selectedMood)
    };
    
    setMessages([initialMessage]);
  };
  
  const getMoodWelcomeMessage = (selectedMood: Mood): string => {
    switch (selectedMood) {
      case "happy":
        return "It's wonderful to hear you're feeling good today! What's contributing to your happiness? Let's explore those positive feelings together.";
      case "neutral":
        return "You're feeling balanced today. That's a good state to be in. Would you like to talk about maintaining this equilibrium or anything else on your mind?";
      case "sad":
        return "I'm sorry to hear you're feeling down. It takes courage to acknowledge these feelings. Would you like to talk about what's on your mind, or perhaps I could share some encouraging thoughts?";
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
        For neutral moods: Provide balanced perspective and gentle guidance.
        For sad moods: Show compassion, validation, and gentle suggestions for feeling better.
        
        Keep your response conversational, helpful, and focused on wellbeing. Don't use obvious templates or introduce yourself - this is an ongoing conversation.`
      );
      
      const aiMessage = { role: "ai" as const, content: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
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
      case "neutral":
        return <Meh className="h-6 w-6 text-reflectify-blue" />;
      case "sad":
        return <Frown className="h-6 w-6 text-reflectify-purple" />;
      default:
        return null;
    }
  };
  
  // === CONTENT ANALYSIS FUNCTIONS ===
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
  
  // === RENDER FUNCTIONS ===
  const renderRantMode = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Express Yourself</h2>
        <p className="text-muted-foreground">
          Share your thoughts and feelings. Receive supportive AI guidance focused on your wellbeing.
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5">
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
        <div className="glass-card rounded-xl p-6 animate-fade-in space-y-4 border border-reflectify-purple/10 shadow-lg shadow-reflectify-purple/5">
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
          
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => selectMood("happy")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-reflectify-teal/20 group hover:-translate-y-1"
            >
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-reflectify-teal to-green-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Smile className="h-8 w-8" />
              </div>
              <span className="font-medium">Happy</span>
            </button>
            
            <button
              onClick={() => selectMood("neutral")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-reflectify-blue/20 group hover:-translate-y-1"
            >
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-reflectify-blue to-blue-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Meh className="h-8 w-8" />
              </div>
              <span className="font-medium">Neutral</span>
            </button>
            
            <button
              onClick={() => selectMood("sad")}
              className="flex flex-col items-center p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 gap-3 border border-reflectify-purple/20 group hover:-translate-y-1"
            >
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-reflectify-purple to-purple-400 text-white group-hover:scale-110 transition-transform duration-300">
                <Frown className="h-8 w-8" />
              </div>
              <span className="font-medium">Sad</span>
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
                      ? "bg-gradient-to-r from-reflectify-blue to-reflectify-indigo text-white"
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
                className="flex-1 bg-white dark:bg-gray-800 rounded-full px-4 py-2.5 text-foreground border-none focus:ring-1 focus:ring-reflectify-blue outline-none"
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
                    : "bg-gradient-to-r from-reflectify-blue to-reflectify-indigo text-white hover:shadow-md"
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

      <div className="glass-card rounded-xl p-6">
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
        <div className="glass-card rounded-xl p-6 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-medium">Analysis Results</h3>
            {getOverallStatusDisplay()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.toxicity)}`}>
              <p className="text-sm text-muted-foreground mb-1">Toxicity</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.toxicity)}`}>
                {(analysis.toxicity * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.insult)}`}>
              <p className="text-sm text-muted-foreground mb-1">Insult</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.insult)}`}>
                {(analysis.insult * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.profanity)}`}>
              <p className="text-sm text-muted-foreground mb-1">Profanity</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.profanity)}`}>
                {(analysis.profanity * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.identity_attack)}`}>
              <p className="text-sm text-muted-foreground mb-1">Identity Attack</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.identity_attack)}`}>
                {(analysis.identity_attack * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`rounded-lg p-3 text-center ${getScoreBackground(analysis.threat)}`}>
              <p className="text-sm text-muted-foreground mb-1">Threat</p>
              <p className={`text-xl font-bold ${getScoreColor(analysis.threat)}`}>
                {(analysis.threat * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
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
  
  const renderJournal = () => (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Journal</h2>
        <p className="text-muted-foreground">
          Maintain a personal journal of your thoughts, emotions, and experiences.
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6 text-center space-y-6 border border-reflectify-teal/10 shadow-lg shadow-reflectify-teal/5">
        <div className="flex items-center justify-center p-10">
          <BookText className="h-12 w-12 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Journal functionality coming soon!</p>
      </div>
    </div>
  );
  
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
      default:
        return renderRantMode();
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <section className="py-6 px-4 animate-fade-in">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-1.5 bg-gradient-to-r from-reflectify-blue/10 via-reflectify-purple/10 to-reflectify-teal/10 backdrop-blur-sm rounded-full">
              <span className="text-sm font-medium reflectify-gradient-text px-3 py-1">
                AI-Powered Health & Wellbeing
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight reflectify-gradient-text">
              Reflectify
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Express your thoughts, track your health, and maintain your mental wellbeing with personalized AI guidance.
            </p>
          </div>
          
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="overflow-x-auto pb-3">
              <div className="flex space-x-1 p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm min-w-max">
                <button
                  onClick={() => setActiveTab("rant")}
                  className={`tab-button ${activeTab === "rant" ? "active" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    <span>Express</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4" />
                    <span>Chat</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("health")}
                  className={`tab-button ${activeTab === "health" ? "active" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <HeartPulse className="h-4 w-4" />
                    <span>Health Analysis</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("mindfulness")}
                  className={`tab-button ${activeTab === "mindfulness" ? "active" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span>Mindfulness</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("journal")}
                  className={`tab-button ${activeTab === "journal" ? "active" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <BookText className="h-4 w-4" />
                    <span>Journal</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab("content")}
                  className={`tab-button ${activeTab === "content" ? "active" : ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    <span>Content Analysis</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="min-h-[70vh] pt-8">
              {renderFeatureContent()}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
