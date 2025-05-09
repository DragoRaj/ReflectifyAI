
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface InsightsTabProps {
  journalEntries: any[];
  insights: any;
  loadingInsights: boolean;
  onGenerateInsights: () => void;
}

const InsightsTab = ({
  journalEntries,
  insights,
  loadingInsights,
  onGenerateInsights
}: InsightsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <Button 
          onClick={onGenerateInsights}
          disabled={loadingInsights || journalEntries.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {loadingInsights ? "Generating..." : "Generate AI Wellbeing Insights"}
        </Button>
      </div>

      {!insights && !loadingInsights && (
        <div className="text-center py-12">
          <Lightbulb className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No AI insights yet</h3>
          <p className="text-slate-500 max-w-lg mx-auto mt-2">
            Click the button above to generate AI insights based on your journal entries and tracked mood data.
          </p>
          {journalEntries.length === 0 && (
            <div className="mt-4">
              <p className="text-sm text-amber-600">You need journal entries to generate insights.</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => window.location.hash = "journal"}
              >
                Create Journal Entry
              </Button>
            </div>
          )}
        </div>
      )}

      {loadingInsights && (
        <div className="space-y-4">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6 mb-1" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
            </div>
            <div>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
            </div>
          </div>
        </div>
      )}

      {insights && (
        <Card className="border-indigo-200 shadow-lg">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Lightbulb className="h-5 w-5 text-indigo-600" />
              Wellbeing Insights
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Mood Trend</h3>
                <p className="text-slate-700">{insights.moodTrend}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-amber-700">Areas of Concern</h3>
                  <ul className="space-y-2">
                    {insights.concerns.map((concern, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-slate-700">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 text-emerald-700">Positive Patterns</h3>
                  <ul className="space-y-2">
                    {insights.positives.map((positive, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-slate-700">{positive}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-indigo-700">Suggestions for Improvement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {insights.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <h4 className="font-medium">Suggestion</h4>
                      </div>
                      <p className="text-slate-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InsightsTab;
