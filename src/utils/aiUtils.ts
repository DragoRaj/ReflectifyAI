
const GEMINI_API_KEY = "AIzaSyDrVNCmoSPUvEXjQyfRm-fAQxoPUEYBzfU";
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

export const getAIWellbeingInsights = async (journalEntries) => {
  try {
    // Format journal entries for the AI prompt
    const entriesText = journalEntries.map(entry => 
      `Date: ${new Date(entry.created_at).toLocaleDateString()}, Mood: ${entry.mood}/10, Title: ${entry.title}, Content: ${entry.content}`
    ).join("\n\n");

    const prompt = `
      Analyze the following journal entries and provide wellbeing insights. Focus on:
      1. Overall mood trends
      2. Potential areas of concern
      3. Positive patterns to reinforce
      4. Three actionable suggestions for improvement

      Format your response as a valid JSON with these sections:
      {
        "moodTrend": "string",
        "concerns": ["string", "string"],
        "positives": ["string", "string"],
        "suggestions": ["string", "string", "string"]
      }

      Journal Entries:
      ${entriesText}
    `;

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) throw new Error("Failed to get wellbeing insights");
    
    const data = await response.json();
    
    try {
      // Extract the JSON from the text response
      const textResponse = data.candidates[0].content.parts[0].text;
      // Find the JSON object in the text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error("Error parsing insights response:", err);
      throw new Error("Could not parse insights result");
    }
  } catch (error) {
    console.error("Error getting wellbeing insights:", error);
    throw error;
  }
};

export const analyzeMoodTrends = async (moodData) => {
  try {
    const moodDataString = JSON.stringify(moodData);
    
    const prompt = `
      Analyze the following mood tracking data and provide insights on the user's emotional wellbeing trends.
      For each insight, provide a brief explanation of what it means and a suggestion for the user.
      
      Format your response as a valid JSON with these sections:
      {
        "overallTrend": "string",
        "insights": [
          {"title": "string", "description": "string", "suggestion": "string"},
          {"title": "string", "description": "string", "suggestion": "string"},
          {"title": "string", "description": "string", "suggestion": "string"}
        ]
      }

      Mood Data (date, mood name, value from 1-5):
      ${moodDataString}
    `;

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) throw new Error("Failed to analyze mood trends");
    
    const data = await response.json();
    
    try {
      // Extract the JSON from the text response
      const textResponse = data.candidates[0].content.parts[0].text;
      // Find the JSON object in the text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error("Error parsing mood analysis response:", err);
      throw new Error("Could not parse mood analysis result");
    }
  } catch (error) {
    console.error("Error analyzing mood trends:", error);
    throw error;
  }
};

// New function to analyze journal entries
export const analyzeJournalEntry = async (journalEntry) => {
  try {
    const prompt = `
      Analyze this journal entry and provide personalized feedback:
      
      Date: ${new Date(journalEntry.created_at).toLocaleDateString()}
      Title: ${journalEntry.title}
      Mood: ${journalEntry.mood}/10
      Entry: ${journalEntry.content}
      
      Provide feedback in this JSON format:
      {
        "summary": "Brief summary of key themes and emotions",
        "insights": [
          "Insight 1 about patterns or feelings expressed",
          "Insight 2 about patterns or feelings expressed"
        ],
        "strengths": "Positive aspects identified in the entry",
        "suggestions": "Gentle suggestions for reflection or improvement",
        "followupQuestions": [
          "Question 1 to deepen reflection",
          "Question 2 to deepen reflection"
        ]
      }
    `;

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) throw new Error("Failed to analyze journal entry");
    
    const data = await response.json();
    
    try {
      // Extract the JSON from the text response
      const textResponse = data.candidates[0].content.parts[0].text;
      // Find the JSON object in the text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error("Error parsing journal analysis response:", err);
      throw new Error("Could not parse journal analysis result");
    }
  } catch (error) {
    console.error("Error analyzing journal entry:", error);
    throw error;
  }
};

// Function to generate enhanced onboarding survey questions
export const generateSurveyQuestions = async (role: string) => {
  try {
    const prompt = `
      Generate a comprehensive set of onboarding survey questions for a ${role} using a student wellbeing app.
      
      The questions should cover:
      1. Current mental wellbeing status
      2. Primary wellbeing goals
      3. Existing wellbeing practices
      4. Potential areas of concern
      5. Personal preferences for wellbeing activities
      
      Format your response as a valid JSON with this structure:
      {
        "sections": [
          {
            "title": "Section title",
            "description": "Brief description of section purpose",
            "questions": [
              {
                "id": "unique_id",
                "text": "Question text",
                "type": "text|select|multiselect|scale|checkbox",
                "options": ["Option 1", "Option 2"] // Only for select, multiselect, checkbox types
                "min": 1, // Only for scale type
                "max": 10, // Only for scale type
                "labels": ["Low", "High"] // Only for scale type
              }
            ]
          }
        ]
      }
      
      Return only valid JSON with no additional text.
    `;

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) throw new Error("Failed to generate survey questions");
    
    const data = await response.json();
    
    try {
      // Extract the JSON from the text response
      const textResponse = data.candidates[0].content.parts[0].text;
      // Find the JSON object in the text
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error("Error parsing survey questions response:", err);
      throw new Error("Could not parse survey questions result");
    }
  } catch (error) {
    console.error("Error generating survey questions:", error);
    throw error;
  }
};
