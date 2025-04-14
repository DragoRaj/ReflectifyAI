
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, PenLine, Save, Plus, Trash, ArrowLeft, ArrowRight, FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
};

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);
  
  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);
  
  const createNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: "",
      content: "",
      mood: "neutral"
    };
    
    setCurrentEntry(newEntry);
    setIsEditing(true);
  };
  
  const saveEntry = () => {
    if (!currentEntry) return;
    
    if (!currentEntry.title.trim()) {
      toast.error("Please add a title for your journal entry");
      return;
    }
    
    if (!currentEntry.content.trim()) {
      toast.error("Please write something in your journal entry");
      return;
    }
    
    // If we're editing an existing entry, update it
    if (entries.some(entry => entry.id === currentEntry.id)) {
      setEntries(entries.map(entry => 
        entry.id === currentEntry.id ? currentEntry : entry
      ));
      toast.success("Journal entry updated");
    } else {
      // Otherwise add a new entry
      setEntries([...entries, currentEntry]);
      toast.success("New journal entry saved");
    }
    
    setIsEditing(false);
    setCurrentEntry(null);
  };
  
  const deleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter(entry => entry.id !== id));
      
      if (currentEntry && currentEntry.id === id) {
        setCurrentEntry(null);
        setIsEditing(false);
      }
      
      toast.success("Journal entry deleted");
    }
  };
  
  const viewEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setIsEditing(false);
  };
  
  const editCurrentEntry = () => {
    if (currentEntry) {
      setIsEditing(true);
    }
  };
  
  const navigateEntries = (direction: "prev" | "next") => {
    if (!currentEntry || entries.length <= 1) return;
    
    const currentIndex = entries.findIndex(entry => entry.id === currentEntry.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === "prev") {
      newIndex = (currentIndex - 1 + entries.length) % entries.length;
    } else {
      newIndex = (currentIndex + 1) % entries.length;
    }
    
    setCurrentEntry(entries[newIndex]);
    setIsEditing(false);
  };
  
  const filteredEntries = searchTerm 
    ? entries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : entries;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight reflectify-gradient-text">Journal</h2>
        <p className="text-muted-foreground">
          Maintain a personal journal of your thoughts, emotions, and experiences.
        </p>
      </div>
      
      {!isEditing && !currentEntry ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search journal entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button 
              onClick={createNewEntry}
              className="theme-bg hover:bg-opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
          
          {sortedEntries.length === 0 ? (
            <div className="glass-card rounded-xl p-10 text-center space-y-4 border theme-border border-opacity-10">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-medium">No Journal Entries</h3>
              <p className="text-muted-foreground">
                Start capturing your thoughts and experiences by creating your first journal entry.
              </p>
              <Button 
                onClick={createNewEntry}
                className="theme-bg hover:bg-opacity-90 mt-2"
              >
                <PenLine className="h-4 w-4 mr-2" />
                Start Writing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedEntries.map(entry => (
                <div 
                  key={entry.id} 
                  className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1 border theme-border border-opacity-10"
                  onClick={() => viewEntry(entry)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium truncate mr-2">{entry.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 whitespace-nowrap">
                      {format(parseISO(entry.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 font-journal">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 space-y-4 border theme-border border-opacity-10 animate-scale-in">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                setCurrentEntry(null);
                setIsEditing(false);
              }}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2">
              {!isEditing && currentEntry && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigateEntries("prev")} 
                    disabled={entries.length <= 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigateEntries("next")} 
                    disabled={entries.length <= 1}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {currentEntry && !isEditing && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={editCurrentEntry}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
              )}
              
              {currentEntry && entries.some(entry => entry.id === currentEntry.id) && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => deleteEntry(currentEntry.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Entry Title"
                    value={currentEntry?.title || ""}
                    onChange={(e) => setCurrentEntry({ ...currentEntry!, title: e.target.value })}
                    className="text-lg font-medium"
                  />
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{currentEntry ? format(parseISO(currentEntry.date), 'MMM d, yyyy') : ''}</span>
                </div>
              </div>
              
              <Textarea
                placeholder="Write your thoughts here..."
                value={currentEntry?.content || ""}
                onChange={(e) => setCurrentEntry({ ...currentEntry!, content: e.target.value })}
                className="min-h-[300px] font-journal text-lg bg-transparent border-0 focus-visible:ring-0 resize-none p-2 outline-none"
              />
              
              <div className="flex justify-end">
                <Button 
                  onClick={saveEntry}
                  className="theme-bg hover:bg-opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            </div>
          ) : (
            currentEntry && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium theme-text">{currentEntry.title}</h3>
                  <span className="text-sm text-muted-foreground bg-muted rounded-full px-3 py-1">
                    {format(parseISO(currentEntry.date), 'MMMM d, yyyy')}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="whitespace-pre-line font-journal text-lg leading-relaxed">
                    {currentEntry.content}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Journal;
