import { GoogleGenerativeAI } from "@google/generative-ai";
import { sanitizeInput, createRateLimiter } from "../utils/sanitize";

/**
 * Gemini AI service module for VoteWise chatbot.
 * Handles all communication with the Google Generative AI API.
 * @module services/gemini
 */

/** @type {string} API key sourced from environment variables */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

/** Rate limiter: max 1 API call per second to prevent abuse */
const rateLimiter = createRateLimiter(1000);

/**
 * System instruction templates for different assistant modes.
 * Each mode tailors the AI personality and scope for better UX.
 * @type {Object<string, function(string): string>}
 */
const ASSISTANT_MODES = {
  'voter-education': (language) => `You are VoteWise AI — Voter Education Specialist for Indian citizens.
      Your primary role is to educate citizens about the complete voting process in India.
      Cover topics like: voter registration (Form 6, Form 6A, Form 6B), Voter ID (EPIC), EVM and VVPAT functioning, 
      election day procedures, postal ballots, proxy voting, accessible voting for PwD, election phases, 
      the Model Code of Conduct, and voters' rights under the Representation of the People Act.
      Use simple analogies and step-by-step explanations. Be encouraging about civic participation.
      The current conversation language is ${language}. Please respond in ${language}.
      Ensure your tone is polite, encouraging, and neutral. Avoid political bias.`,
      
  'real-time-updates': (language) => `You are VoteWise AI — Election Updates Specialist for Indian citizens.
      Your primary role is to provide the latest information about upcoming and ongoing elections in India.
      Cover topics like: election schedules and phases, polling dates, result announcement dates,
      voter registration deadlines, important ECI announcements, voter turnout statistics,
      state-wise election calendars, by-election updates, and key dates citizens should know.
      When asked about specific elections, provide the most recent information you have.
      If you don't have real-time data, clearly state that and suggest checking eci.gov.in for the latest updates.
      The current conversation language is ${language}. Please respond in ${language}.
      Ensure your tone is informative, timely, and neutral. Avoid political bias.`,
      
  'default': (language) => `You are VoteWise AI, a helpful assistant for Indian citizens. 
      Provide accurate information about the election process, voting rights, and registration in simple terms. 
      The current conversation language is ${language}. Please respond in ${language}.
      Ensure your tone is polite, encouraging, and neutral. 
      Avoid political bias. Focus on educating voters about the process (EVM, VVPAT, Form 6, Voter ID, etc.)`
};

/**
 * Generates a chat response from the Gemini AI model.
 * Includes input sanitization, rate limiting, and graceful fallback.
 *
 * @param {string} prompt - The user's message text.
 * @param {Array} history - Previous chat history for context.
 * @param {string} [language='English'] - The language for the response.
 * @param {string} [assistantMode='default'] - The assistant personality mode.
 * @returns {Promise<string>} The AI-generated response text.
 * @throws {Error} Returns a user-friendly fallback on any failure.
 */
export const generateChatResponse = async (prompt, history = [], language = 'English', assistantMode = 'default') => {
  try {
    // Validate API key presence
    if (API_KEY === "YOUR_GEMINI_API_KEY") {
      throw new Error("Missing API Key");
    }

    // Rate limiting check
    if (!rateLimiter.canProceed()) {
      return "Please wait a moment before sending another message. I'm processing your previous request.";
    }

    // Sanitize user input before sending to API
    const sanitizedPrompt = sanitizeInput(prompt);

    const getSystemInstruction = ASSISTANT_MODES[assistantMode] || ASSISTANT_MODES['default'];

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      systemInstruction: getSystemInstruction(language)
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(sanitizedPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);

    // Friendly localized fallback
    if (language === 'Hindi') {
      return "क्षमा करें, मैं अभी ऑफ़लाइन हूँ। आप पंजीकरण के लिए voters.eci.gov.in पर जा सकते हैं। मैं आपकी और कैसे सहायता कर सकता हूँ?";
    }
    return "I'm currently in offline mode, but I can tell you that the next general election timeline is usually announced by the ECI. For registration, please visit voters.eci.gov.in. How else can I assist?";
  }
};
