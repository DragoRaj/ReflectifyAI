
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsSummaryProps {
  journalEntries: any[];
  moodData: any[];
}

const AnalyticsSummary = ({ journalEntries, moodData }: AnalyticsSummaryProps) => {
  // Calculate average mood - Fix: Ensure we're working with numbers
  const calculateAverageMood = () => {
    if (journalEntries.length === 0) return "N/A";
    
    const sum = journalEntries.reduce((total, entry) => {
      // Ensure the mood is treated as a number
      const moodValue = typeof entry.mood === 'number' ? entry.mood : 0;
      return total + moodValue;
    }, 0);
    
    return (sum / journalEntries.length).toFixed(1);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{journalEntries.length}</div>
          <p className="text-sm text-slate-500">
            {journalEntries.length > 0 
              ? `Last entry: ${new Date(journalEntries[0].created_at).toLocaleDateString()}`
              : "No entries yet"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Mood Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{moodData.length}</div>
          <p className="text-sm text-slate-500">
            {moodData.length > 0 
              ? `Latest mood: ${moodData[moodData.length - 1].mood}`
              : "No mood data yet"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Average Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {calculateAverageMood()}
            <span className="text-sm text-slate-500 ml-1">/ 10</span>
          </div>
          <p className="text-sm text-slate-500">Based on journal entries</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
