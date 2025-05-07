
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAIAnalysis } from "./aiUtils";

export async function saveWellbeingMetric(
  studentId: string, 
  wellbeingScore: number, 
  sentimentScore?: number,
  stressLevel?: number
): Promise<boolean> {
  try {
    const { error } = await supabase.from("wellbeing_metrics").insert({
      student_id: studentId,
      wellbeing_score: wellbeingScore,
      sentiment_score: sentimentScore || null,
      stress_level: stressLevel || null
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving wellbeing metric:", error);
    return false;
  }
}

export async function getWellbeingInsight(studentId: string): Promise<string> {
  try {
    // Get recent wellbeing metrics
    const { data: metrics, error } = await supabase
      .from("wellbeing_metrics")
      .select("*")
      .eq("student_id", studentId)
      .order("measured_at", { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    if (!metrics || metrics.length === 0) {
      return "Not enough data to generate insights yet.";
    }
    
    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, role")
      .eq("id", studentId)
      .single();
    
    try {
      // Build a prompt for the AI
      const prompt = `
        Based on the following wellbeing metrics for ${profile?.first_name || 'a student'}, 
        provide a brief, helpful insight about their wellbeing trends:
        
        Recent wellbeing scores (1-10): ${metrics.map(m => m.wellbeing_score).filter(Boolean).join(', ')}
        Recent stress levels (1-10): ${metrics.map(m => m.stress_level).filter(Boolean).join(', ')}
        
        Generate a short, personalized insight (2-3 sentences) that is age-appropriate 
        and helpful without being alarmist. Focus on trends, if any, and offer a gentle 
        suggestion if appropriate.
      `;
      
      // Use Gemini to generate an insight
      const insight = await getAIAnalysis(prompt);
      return insight || "Your wellbeing metrics show a stable pattern. Continue with your current activities and remember to take breaks when needed.";
    } catch (error) {
      console.error("Error in AI analysis:", error);
      return "Your recent wellbeing data shows some fluctuations. Remember to take time for self-care activities that you enjoy.";
    }
  } catch (error) {
    console.error("Error generating wellbeing insight:", error);
    return "Unable to generate insights at this time.";
  }
}

export async function getRecommendedActivities(
  wellbeingScore: number,
  stressLevel: number,
  preferredActivities: string[] = []
): Promise<string[]> {
  const fallbackActivities = [
    "Practice deep breathing for 2 minutes",
    "Write in your journal about today",
    "Take a short mindfulness break",
    "Stretch for five minutes",
    "Listen to calming music"
  ];
  
  try {
    const prompt = `
      Generate 3 short, specific wellbeing activities for a student with:
      - Current wellbeing score: ${wellbeingScore}/10
      - Current stress level: ${stressLevel}/10
      ${preferredActivities.length > 0 ? 
        `- Preferred coping mechanisms: ${preferredActivities.join(', ')}` : 
        '- No specific preferences provided'}
      
      Format each activity as a single, brief sentence (under 10 words) that starts with an action verb.
      Make them specific, actionable, and appropriate for school setting.
    `;
    
    try {
      const response = await getAIAnalysis(prompt);
      
      // Parse the response into an array of activities
      const activities = response
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 0 && !line.startsWith('-'))
        .slice(0, 3);
      
      return activities.length > 0 ? activities : fallbackActivities;
    } catch (error) {
      console.error("Error in AI analysis:", error);
      // Return appropriate fallback activities based on wellbeing score
      if (wellbeingScore < 4) {
        return [
          "Talk to someone you trust",
          "Practice five minutes of deep breathing",
          "Write down three positive thoughts"
        ];
      } else if (wellbeingScore < 7) {
        return [
          "Take a short walk outside",
          "Listen to your favorite uplifting song",
          "Stretch for five minutes"
        ];
      } else {
        return [
          "Share your positive energy with others",
          "Try something creative today",
          "Express gratitude for three things"
        ];
      }
    }
  } catch (error) {
    console.error("Error generating activities:", error);
    return fallbackActivities;
  }
}
