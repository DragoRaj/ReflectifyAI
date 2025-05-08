
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignOutButton } from "@/components/SignOutButton";
import {
  MessageCircle,
  Home,
  User,
  Send,
  Bot,
  RefreshCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WellbeingChatPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Sample responses to simulate AI chat
  const sampleResponses = [
    "Thank you for sharing that with me. How long have you been feeling this way?",
    "It sounds like you're going through a difficult time. What helps you feel better when you're stressed?",
    "I understand that can be challenging. Have you tried talking to someone you trust about this?",
    "That's a normal reaction to stress. Remember to practice self-care and be kind to yourself.",
    "I'm here to listen. Would you like to tell me more about what's been happening?",
    "It can be helpful to break down big problems into smaller, more manageable steps. What's one small thing you could do today?",
    "Remember that you're not alone in feeling this way. Many students experience similar challenges.",
    "That's great progress! What positive changes have you noticed since you started doing that?",
    "I'm sorry to hear you're struggling. Have you considered speaking with your school counselor about this?",
    "Let's focus on what you can control. What's one aspect of this situation that you have influence over?"
  ];

  useEffect(() => {
    async function fetchChatHistory() {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("chat_interactions")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) {
          throw error;
        }

        setChatHistory(data || []);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        toast.error("Failed to load chat history");
      } finally {
        setLoading(false);
      }
    }

    fetchChatHistory();
  }, [user]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      setSending(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get random response
      const aiResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      // Save to database
      const { error } = await supabase
        .from("chat_interactions")
        .insert([
          {
            user_id: user.id,
            user_message: message,
            ai_response: aiResponse,
          }
        ]);

      if (error) {
        throw error;
      }
      
      // Add to chat state for immediate display
      setChatHistory([
        ...chatHistory, 
        {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          user_message: message,
          ai_response: aiResponse
        }
      ]);
      
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!user) return;
    
    if (!window.confirm("Are you sure you want to clear your chat history?")) return;
    
    try {
      // This would require additional permission on the database
      // For now just clear the UI
      setChatHistory([]);
      toast.success("Chat history cleared");
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast.error("Failed to clear chat history");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            Wellbeing Chat
          </h1>
          <p className="text-slate-600">Chat with an AI assistant about your wellbeing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")} 
            className="flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-indigo-50 border-indigo-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <MessageCircle className="h-5 w-5" />
                Wellbeing Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Chat with our AI assistant about how you're feeling. Your conversations are private and help us better support your wellbeing.
              </p>
              <Button 
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50" 
                onClick={clearChat}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Clear Chat History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Tips for Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Be honest about how you're feeling</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Try to be specific about your concerns</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>Remember this is a safe space to share</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                  <span>For immediate help, always talk to a teacher or counselor</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Your Conversation</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center p-8">Loading conversation...</div>
              ) : chatHistory.length > 0 ? (
                <div className="space-y-6">
                  {chatHistory.map((interaction, index) => (
                    <div key={interaction.id || index} className="space-y-4">
                      <div className="flex gap-3 items-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-indigo-100 text-indigo-800">
                            {profile?.first_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">You</span>
                            <span className="text-xs text-slate-500">
                              {format(new Date(interaction.created_at), "h:mm a")}
                            </span>
                          </div>
                          <p className="text-slate-700 rounded-lg py-2">
                            {interaction.user_message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 items-start">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-emerald-100 text-emerald-800">
                            AI
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Wellbeing Assistant</span>
                            <span className="text-xs text-slate-500">
                              {format(new Date(interaction.created_at), "h:mm a")}
                            </span>
                          </div>
                          <p className="text-slate-700 rounded-lg py-2">
                            {interaction.ai_response}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-center py-8 h-full flex flex-col items-center justify-center">
                  <Bot className="h-16 w-16 text-slate-300 mb-2" />
                  <h3 className="font-medium text-lg">Start a Conversation</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Share how you're feeling today or ask for support with anything that's on your mind.
                  </p>
                </div>
              )}
            </CardContent>
            
            <div className="p-4 border-t">
              <form 
                onSubmit={(e) => { 
                  e.preventDefault();
                  handleSendMessage();
                }} 
                className="flex gap-2"
              >
                <Input
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={sending || !message.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {sending ? (
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="ml-2">Send</span>
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
