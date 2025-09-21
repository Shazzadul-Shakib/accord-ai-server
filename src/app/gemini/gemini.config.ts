import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';
import AppError from '../errorHandlers/appError';
import { status } from 'http-status';
import { extractJsonFromMarkdown } from '../utils/extractJsonUtils';
import { SummaryResponse } from '../interface/summary.interface';

// ----- Initialize Gemini AI----- //
const genAI = new GoogleGenerativeAI(config.gemini_api_key as string);

// ----- Generate chat summary ----- //
export async function generateChatSummary(
  formattedChat: string,
  topic: string,
) {
  // ----- Create prompt for summarization ----- //
  const prompt = `
  Please provide a concise summary of the following chat conversation${topic ? ` about "${topic}"` : ''}:
  
  ${formattedChat}
  
   Please respond with ONLY a valid JSON object following this exact structure:
  {
    "summary": {
      "title": "Brief title for the chat",
      "description": "2-3 sentence overview of the conversation",
      "points": [
        {
          "time": "Beginning/Mid-conversation/End",
          "event": "Description of what happened"
        }
      ],
      "conclusions": [
        "Key takeaway 1",
        "Key takeaway 2"
      ],
      "metadata": {
        "wordCount": 0,
        "timestamp": "${new Date().toISOString()}"
      }
    }
  }
  
  Requirements:
  - Provide 3-5 key points maximum
  - Keep conclusions concise and actionable
  - Focus on decisions, action items, and important discussions
  - Use clear, professional language
  - Return ONLY the JSON object, no additional text or markdown
  `;

  // ----- Get Gemini model ----- //
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    generationConfig: {
      temperature: 0.3, // Lower temperature for more consistent JSON output
      topP: 0.8,
      topK: 40,
    },
  });

  try {
    // ----- Generate summary ----- //
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // ----- Extract and parse JSON ----- //
    let jsonString: string;
    try {
      jsonString = extractJsonFromMarkdown(responseText);
    } catch {
      // ----- If extraction fails, try parsing the entire response ----- //
      jsonString = responseText.trim();
    }

    // ----- Parse JSON ----- //
    const summaryData: SummaryResponse = JSON.parse(jsonString);

    // ----- Validate the structure ----- //
    if (
      !summaryData.summary ||
      !summaryData.summary.title ||
      !summaryData.summary.points
    ) {
      throw new Error('Invalid summary structure received from AI');
    }

    return summaryData;
  } catch {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to generate chat summary',
    );
  }
}
