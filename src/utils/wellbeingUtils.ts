
import { supabase } from "@/integrations/supabase/client";
import { analyzeContent } from "./aiUtils";
import { toast } from "sonner";

// Function to save a new wellbeing metric from user input
export async function saveWellbeingMetric(
  studentId: string, 
  wellbeingScore: number, 
  text?: string
) {
  try {
    // Start with basic metrics
    const metricData: any = {
      student_id: studentId,
      wellbeing_score: wellbeingScore,
      interaction_count: 1
    };
    
    // If text provided, analyze sentiment
    if (text && text.length > 5) {
      try {
        const analysis = await analyzeContent(text);
        
        if (analysis) {
          // Add sentiment analysis scores
          metricData.sentiment_score = (1 - analysis.toxicity) * 2 - 1; // Convert to -1 to 1 range
          metricData.stress_level = Math.round((analysis.toxicity * 5) + 1); // Convert to 1-10 range
          
          // If severe negative sentiment detected, create a concern flag
          if (analysis.toxicity > 0.7 || analysis.identity_attack > 0.5 || analysis.threat > 0.5) {
            const concernLevel = analysis.toxicity > 0.8 ? 'critical' : 'moderate';
            
            await supabase.from("concern_flags").insert({
              student_id: studentId,
              concern_level: concernLevel,
              reason: `AI detected concerning content: ${analysis.summary}`,
              resolved: false
            });
          }
        }
      } catch (error) {
        console.error("Error analyzing content:", error);
        // Continue without sentiment analysis if it fails
      }
    }
    
    // Save the metric
    const { error } = await supabase.from("wellbeing_metrics").insert(metricData);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error saving wellbeing metric:", error);
    toast.error("Unable to save your response. Please try again later.");
    return false;
  }
}

// Function to calculate wellbeing trend
export function calculateTrend(metrics: any[]): 'improving' | 'declining' | 'stable' {
  if (!metrics || metrics.length < 2) return 'stable';
  
  // Sort by date
  const sortedMetrics = [...metrics].sort(
    (a, b) => new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
  );
  
  // Get the average of first half and second half
  const halfIndex = Math.floor(sortedMetrics.length / 2);
  const firstHalf = sortedMetrics.slice(0, halfIndex);
  const secondHalf = sortedMetrics.slice(halfIndex);
  
  const firstAvg = firstHalf.reduce((sum, m) => sum + m.wellbeing_score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, m) => sum + m.wellbeing_score, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 0.5) return 'improving';
  if (difference < -0.5) return 'declining';
  return 'stable';
}
