
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAIAnalysis } from "@/utils/aiUtils";

const HealthAnalysis = () => {
  const [steps, setSteps] = useState<number>(5000);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"excellent" | "good" | "needs-improvement">("good");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStepsChange = (value: number[]) => {
    setSteps(value[0]);
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await getAIAnalysis(
        `Analyze the health implications of walking ${steps} steps daily. Provide a brief, encouraging assessment of how this impacts cardiovascular health, weight management, and mental wellbeing. Keep it concise (around 3-4 sentences) and focus on the positive benefits, while suggesting improvements if the step count is below 7000 steps. For greater than 10000 steps, be very encouraging.`
      );
      
      setAnalysis(result);
      
      // Determine health status based on steps
      if (steps >= 10000) {
        setHealthStatus("excellent");
      } else if (steps >= 7000) {
        setHealthStatus("good");
      } else {
        setHealthStatus("needs-improvement");
      }
      
      toast.success("Analysis generated!");
    } catch (error) {
      console.error("Failed to generate analysis:", error);
      toast.error("Failed to generate analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial analysis on component mount
  useEffect(() => {
    generateAnalysis();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Health Analysis</h2>
        <p className="text-muted-foreground">
          Analyze your daily step count and its impact on your overall health.
        </p>
      </div>
      
      <div className="glass-card rounded-xl p-6 space-y-6 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Daily Step Count</h3>
            <span className="bg-reflectify-blue/10 text-reflectify-blue rounded-full px-3 py-1 text-sm font-medium">
              {steps.toLocaleString()} steps
            </span>
          </div>
          
          <div className="py-4">
            <Slider 
              min={1000} 
              max={15000} 
              step={500} 
              value={[steps]} 
              onValueChange={handleStepsChange}
              className="py-2"
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>1,000</span>
              <span>15,000</span>
            </div>
          </div>
          
          <Button 
            onClick={generateAnalysis}
            disabled={isLoading}
            className="w-full reflectify-button"
          >
            {isLoading ? "Analyzing..." : "Analyze Health Impact"}
          </Button>
        </div>
        
        {analysis && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              {healthStatus === "excellent" && (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Excellent Progress</span>
                </div>
              )}
              
              {healthStatus === "good" && (
                <div className="flex items-center gap-2 text-reflectify-blue">
                  <Info className="h-5 w-5" />
                  <span className="font-medium">Good Progress</span>
                </div>
              )}
              
              {healthStatus === "needs-improvement" && (
                <div className="flex items-center gap-2 text-amber-500">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Room for Improvement</span>
                </div>
              )}
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-reflectify-blue/5 to-reflectify-purple/5 border border-reflectify-blue/10">
              <p className="text-foreground leading-relaxed">{analysis}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg p-4 text-center bg-white dark:bg-gray-800 shadow-sm">
                <div className="text-2xl font-semibold mb-1 text-reflectify-blue">
                  {(steps / 1000).toFixed(1)}k
                </div>
                <div className="text-xs text-muted-foreground">
                  Daily Steps
                </div>
              </div>
              
              <div className="rounded-lg p-4 text-center bg-white dark:bg-gray-800 shadow-sm">
                <div className="text-2xl font-semibold mb-1 text-reflectify-purple">
                  {Math.round(steps * 0.04)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Calories Burned
                </div>
              </div>
              
              <div className="rounded-lg p-4 text-center bg-white dark:bg-gray-800 shadow-sm">
                <div className="text-2xl font-semibold mb-1 text-reflectify-teal">
                  {(steps / 1350).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Miles Walked
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAnalysis;
