
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignOutButton } from "@/components/SignOutButton";
import {
  BookText,
  CalendarDays,
  Edit,
  Home,
  PlusCircle,
  Search,
  Trash2,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function JournalPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: 5
  });

  useEffect(() => {
    async function fetchJournalEntries() {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setEntries(data || []);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        toast.error("Failed to load journal entries");
      } finally {
        setLoading(false);
      }
    }

    fetchJournalEntries();
  }, [user]);

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert([
          {
            title: newEntry.title,
            content: newEntry.content,
            mood: newEntry.mood,
            user_id: user.id
          }
        ]);

      if (error) {
        throw error;
      }

      toast.success("Journal entry created successfully");
      setShowNewEntryDialog(false);
      setNewEntry({ title: "", content: "", mood: 5 });
      
      // Reload entries
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });
      
      setEntries(data || []);
      
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast.error("Failed to create journal entry");
    }
  };

  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            Journal
          </h1>
          <p className="text-slate-600">Express your thoughts and track your wellbeing journey</p>
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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          <Card className="bg-indigo-50 border-indigo-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <BookText className="h-5 w-5" />
                Your Journal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Journaling provides a safe space to express your thoughts, track your emotions, and reflect on your experiences.
              </p>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700" 
                onClick={() => setShowNewEntryDialog(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Journal Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total entries</span>
                  <span className="font-medium">{entries.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">This month</span>
                  <span className="font-medium">
                    {entries.filter(entry => new Date(entry.created_at).getMonth() === new Date().getMonth()).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Average mood</span>
                  <span className="font-medium">
                    {entries.length > 0 
                      ? (entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Your Entries</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">Loading entries...</div>
              ) : filteredEntries.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntries.map(entry => (
                    <Card key={entry.id} className="border-l-4 border-l-indigo-400">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{entry.title}</h3>
                            <div className="flex items-center text-sm text-slate-500 mb-2">
                              <CalendarDays className="h-3.5 w-3.5 mr-1" />
                              {format(new Date(entry.created_at), "PPP")}
                              <span className="mx-2">•</span>
                              <span>Mood: {entry.mood}/10</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-slate-600 whitespace-pre-wrap">{entry.content.length > 200 ? `${entry.content.substring(0, 200)}...` : entry.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="font-medium text-lg">No entries found</h3>
                  <p className="text-slate-500">
                    {entries.length === 0 
                      ? "Start journaling to track your thoughts and emotions"
                      : "No entries match your search criteria"}
                  </p>
                  {entries.length === 0 && (
                    <Button 
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => setShowNewEntryDialog(true)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create your first entry
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Entry Dialog */}
      <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
            <DialogDescription>
              Express your thoughts and feelings in your private journal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                placeholder="Enter a title for your entry"
                value={newEntry.title}
                onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                rows={8}
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                className="resize-none"
              />
            </div>
            
            <div>
              <label htmlFor="mood" className="text-sm font-medium">How are you feeling today? (1-10)</label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: parseInt(e.target.value)})}
                  className="flex-1 accent-indigo-600"
                />
                <span className="text-sm">10</span>
                <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-sm font-medium">
                  {newEntry.mood}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewEntryDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateEntry}>Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
