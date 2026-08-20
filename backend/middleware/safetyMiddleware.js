/*
import { Filter } from "bad-words"; // Note the curly braces { }
import fs from "fs";

const filter = new Filter();

export const validateContent = (req, res, next) => {
  const { name, location, description } = req.body;
  const fields = [name, location, description];

  // 1. Check for Profanity (e.g., "fuck")
  const hasProfane = fields.some(field => field && filter.isProfane(field));

  // 2. Check for AI Refusal Strings (Llama refusals)
  const isAiRefusal = description && (
    description.includes("I can't write") || 
    description.includes("explicit content") ||
    description.includes("Inappropriate language")
  );

  if (hasProfane || isAiRefusal) {
    console.log("🚫 Security Block Triggered: Filtering offensive content.");
    
    // Clean up the uploaded file from the server immediately
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(400).json({ 
      message: "Security Block", 
      reason: "Inappropriate language or AI refusal detected." 
    });
  }

  next(); // If clean, move to the next logic (Gemini Verification)
};

*/

import { Filter } from "bad-words";
import fs from "fs";

const filter = new Filter();

export const validateContent = (req, res, next) => {
  const { name, location, description } = req.body;
  console.log("VALIDATION RUNNING:", name, location);
  const fields = [name, location, description];

  try {
    // 🔒 1. Basic empty check
    if (!name || !location || !description) {
      cleanupFile(req);
      return res.status(400).json({
        message: "Security Block",
        reason: "All fields are required"
      });
    }

    // 🔒 2. Length validation
    if (description.trim().length < 10) {
      cleanupFile(req);
      return res.status(400).json({
        message: "Security Block",
        reason: "Description too short"
      });
    }

    // 🔒 3. Profanity check
    const hasProfane = fields.some(field => field && filter.isProfane(field));
    if (hasProfane) {
      cleanupFile(req);
      return res.status(400).json({
        message: "Security Block",
        reason: "Inappropriate language detected"
      });
    }

    // 🔒 4. AI refusal detection
    const isAiRefusal = description && (
      description.toLowerCase().includes("i can't write") ||
      description.toLowerCase().includes("explicit content") ||
      description.toLowerCase().includes("inappropriate language")
    );

    if (isAiRefusal) {
      cleanupFile(req);
      return res.status(400).json({
        message: "Security Block",
        reason: "AI-generated refusal content detected"
      });
    }

    // 🔒 5. Random / spam text detection
    const invalidWords = ["asdf", "qwerty", "random", "test", "nothing"];
    const hasInvalid = invalidWords.some(word =>
      description.toLowerCase().includes(word)
    );

    if (hasInvalid) {
      cleanupFile(req);
      return res.status(400).json({
        message: "Security Block",
        reason: "Invalid or random content"
      });
    }

    // 🔒 6. Meaningful content check (must contain letters)
    if (!/[a-zA-Z]/.test(description)) {
      cleanupFile(req);
      return res.status(400).json({
        message: "Security Block",
        reason: "Description must contain meaningful text"
      });
    }

    next(); // ✅ Passed all checks

  } catch (error) {
    console.error("Validation Error:", error.message);
    cleanupFile(req);

    return res.status(500).json({
      message: "Validation Failed",
      reason: "Server error during validation"
    });
  }
};

// 🔥 Helper: safely delete uploaded file
function cleanupFile(req) {
  try {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  } catch (err) {
    console.error("File cleanup error:", err.message);
  }
}