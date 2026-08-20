/*
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const verifyImageAndCaption = async (filePath, mimeType, name, description) => {
  try {
    // 1. Set strict safety thresholds to catch profanity immediately
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      ]
    });

    const imageData = {
      inlineData: {
        data: fs.readFileSync(filePath).toString("base64"),
        mimeType: mimeType,
      },
    };

    const prompt = `
      You are a STRICT Security Guard for a Lost & Found app. 
      Analyze if this image matches: Name: "${name}", Description: "${description}".

      REJECTION RULES (isVerified = false):
      - PROFANITY: If the text contains slurs or swear words (like "fuck").
      - MISMATCH: If the image is a person/selfie but the name is an object (like "Wallet").
      - FAKE: If the image is a meme, icon, or unrelated to the item name.
      
      Return ONLY JSON: {"isVerified": boolean, "reason": "string"}
    `;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedJson);

  } catch (error) {
    console.error("AI Blocked Post or System Error:", error.message);
    // ❌ BLOCK BY DEFAULT: If Gemini refuses to talk (due to "fuck") or crashes, return false.
    return { 
      isVerified: false, 
      reason: "Inappropriate content or verification failure." 
    };
  }
};
*/


import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const verifyImageAndCaption = async (filePath, mimeType, name, description) => {
  try {
    // 🔒 Hard validation before AI
    if (!description || description.trim().length < 10) {
      return {
        isVerified: false,
        reason: "Description too short or invalid"
      };
    }

    const badWords = ["asdf", "random", "test", "nothing"];
    if (badWords.some(word => description.toLowerCase().includes(word))) {
      return {
        isVerified: false,
        reason: "Invalid or random description"
      };
    }

    // 🤖 Gemini Model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      ]
    });

    const imageData = {
      inlineData: {
        data: fs.readFileSync(filePath).toString("base64"),
        mimeType: mimeType,
      },
    };

    const prompt = `
You are a STRICT AI Security Guard for a Lost & Found app.

Your job is to REJECT fake, random, or unclear posts.

Item Name: "${name}"
Description: "${description}"

STRICT REJECTION RULES (isVerified = false):
1. If description is too short (<10 characters)
2. If description is meaningless (like "asdf", "random", "item", "something")
3. If description does not clearly describe the item
4. If name and description do not match
5. If image is unrelated, meme, cartoon, or not a real item
6. If image is a person/selfie but item is an object
7. If content looks like spam or joke

ACCEPT ONLY IF:
- It clearly describes a real-world item
- Description is meaningful and detailed
- Image matches the item

Be STRICT. When in doubt → REJECT.

Return ONLY JSON:
{
  "isVerified": true/false,
  "confidence": number,
  "reason": "short explanation"
}
`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    const cleanedJson = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);

    // 🔥 Confidence check
    if (parsed.confidence !== undefined && parsed.confidence < 0.5) {
      return {
        isVerified: false,
        reason: "Low confidence match"
      };
    }

    return parsed;

  } catch (error) {
    console.error("AI Blocked Post or System Error:", error.message);

    return {
      isVerified: false,
      reason: "Inappropriate content or verification failure."
    };
  }
};