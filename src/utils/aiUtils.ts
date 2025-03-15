
const GEMINI_API_KEY = "AIzaSyDJDWd17Om9K0NFx8jNcoRoIwQ1NRWYLEo";
const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const getAIAnalysis = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) throw new Error("Failed to get AI response");
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error in AI analysis:", error);
    throw error;
  }
};

export const analyzeContent = async (content: string) => {
  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: `Analyze the following social media post for toxicity, harmful content, and appropriateness. 
            Give scores from 0-1 for: toxicity, insult, profanity, identity_attack, and threat.
            Then classify as "safe", "caution", or "toxic" based on the overall scores.
            Finally, provide a brief summary explaining why.
            Format your response as a valid JSON object with these fields: 
            {toxicity: number, insult: number, profanity: number, identity_attack: number, threat: number, overall: string, summary: string}
            
            Post to analyze: "${content}"`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) throw new Error("Failed to analyze content");
    
    const data = await response.json();
    
    try {
      // Extract the JSON from the text response
      const textResponse = data.candidates[0].content.parts[0].text;
      // Find the JSON object in the text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error("Error parsing response:", err);
      throw new Error("Could not parse analysis result");
    }
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};
