
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
    return insight || "Unable to generate insights at this time.";
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
    
    const response = await getAIAnalysis(prompt);
    
    // Parse the response into an array of activities
    const activities = response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.length > 0 && !line.startsWith('-'))
      .slice(0, 3);
    
    return activities.length > 0 ? 
      activities : 
      ["Try deep breathing exercise", "Write in your journal", "Take a short mindfulness break"];
  } catch (error) {
    console.error("Error generating activities:", error);
    return ["Try deep breathing exercise", "Write in your journal", "Take a short mindfulness break"];
  }
}
