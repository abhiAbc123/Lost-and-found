import express from "express";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Item from "../models/Item.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();


// ================== AI CHAT ==================
router.post("/ai/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ UPDATED MODEL
        messages: [
          {
            role: "system",
            content: "You are a helpful Lost & Found assistant.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    const reply =
      response?.data?.choices?.[0]?.message?.content || "No reply";

    res.json({ reply });

  } catch (error) {
    console.error("CHAT FALLBACK:", error.response?.data || error.message);

    // ✅ FALLBACK RESPONSE (NO API FAILURE)
    let reply = "I'm here to help with lost and found items.";

    if (message.toLowerCase().includes("lost")) {
      reply = "If you lost something, create a Lost post with details like location and description.";
    } else if (message.toLowerCase().includes("found")) {
      reply = "If you found something, create a Found post so the owner can contact you.";
    }

    res.json({ reply });
  }
});


// ================== LOST DESCRIPTION ==================
router.post("/ai/lost-description", async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ UPDATED
        messages: [
          {
            role: "system",
            content: "Write short lost item descriptions.",
          },
          {
            role: "user",
            content: `Lost Item: ${name}, last seen at ${location}.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    const description =
      response?.data?.choices?.[0]?.message?.content || "No description";

    res.json({ description });

  } catch (err) {
    console.error("LOST FALLBACK:", err.response?.data || err.message);

    // ✅ FALLBACK
    res.json({
      description: `Lost Item: ${name}. Last seen at ${location}. Please contact if found.`,
    });
  }
});


// ================== FOUND DESCRIPTION ==================
router.post("/ai/description", async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // ✅ UPDATED
        messages: [
          {
            role: "system",
            content: "Write short found item descriptions.",
          },
          {
            role: "user",
            content: `Found Item: ${name} at ${location}.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    const description =
      response?.data?.choices?.[0]?.message?.content || "No description";

    res.json({ description });

  } catch (err) {
    console.error("FOUND FALLBACK:", err.response?.data || err.message);

    // ✅ FALLBACK
    res.json({
      description: `Found Item: ${name} at ${location}. Owner can contact to claim.`,
    });
  }
});
// ================== CLOUDINARY ==================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ================== MULTER ==================
const upload = multer({ dest: "uploads/" });


// ================== CREATE ITEM ==================
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, location, description, type, date, phone } = req.body;

    if (!name || !location || !type) {
      return res.status(400).json({ message: "Name, location, and type are required." });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lost_found_items",
        resource_type: "auto",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newItem = new Item({
      name,
      location,
      description,
      type,
      date: date || new Date().toISOString(),
      user: req.user.id,
      phone: phone || null,
      image: imageUrl,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ================== GET USER ITEMS ==================
router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================== GET ALL ITEMS ==================
router.get("/all", async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================== GET SINGLE ITEM ==================
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================== DELETE ITEM ==================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================== CONTACT INFO ==================
router.get("/contact/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email phone");

    if (!item) return res.status(404).json({ message: "Item not found" });

    const phone = item.phone || item.user.phone;

    res.json({
      ownerName: item.user.name,
      phone,
      email: item.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contact info" });
  }
});


// ================== UPDATE ITEM ==================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, type, location, description, image } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Post not found" });

    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    item.name = name || item.name;
    item.type = type || item.type;
    item.location = location || item.location;
    item.description = description || item.description;
    item.image = image || item.image;

    const updatedItem = await item.save();

    res.json(updatedItem);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;


/*
import express from "express";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Item from "../models/Item.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyImageAndCaption } from "../middleware/aiController.js";
import { validateContent } from "../middleware/safetyMiddleware.js"; 
import fetch from "node-fetch";
import axios from "axios";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// --- 1. CLOUDINARY & MULTER CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

// --- 2. AI CHATBOT & DESCRIPTION ROUTES (SambaNova) ---

// General AI Chatbot
router.post("/ai/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      "https://api.sambanova.ai/v1/chat/completions",
      {
        model: "Meta-Llama-3.3-70B-Instruct",
        messages: [
          { role: "system", content: "You are an assistant for a Lost and Found app. Short, helpful responses." },
          { role: "user", content: message },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`
        },
      }
    );
    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Chatbot error" });
  }
});

// Generate Lost/Found Descriptions
router.post("/ai/lost-description", async (req, res) => {
  const { name, location } = req.body;
  try {
    if (!name || !location) return res.status(400).json({ message: "Name and location required" });

    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
          { role: "system", content: "You write clear lost item descriptions." },
          { role: "user", content: `Write a short description for: ${name} near ${location}.` },
        ],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    res.json({ description: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate description" });
  }
});

// --- 3. CORE CRUD ROUTES ---

// ✅ CREATE ITEM (The Secure Route)
router.post("/", verifyToken, upload.single("image"), validateContent, async (req, res) => {
  try {
    const { name, location, description, type, date, phone } = req.body;

    if (!name || !location || !type) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Missing required fields" });
    }

    // A. AI VISION VERIFICATION
    let aiStatus = { isVerified: true, reason: "No image provided" };
    if (req.file) {
      aiStatus = await verifyImageAndCaption(req.file.path, req.file.mimetype, name, description);
      
      if (aiStatus.isVerified === false) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path); 
        return res.status(400).json({ message: "Fake Post Detected", reason: aiStatus.reason });
      }
    }

    // B. CLOUDINARY UPLOAD
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "lost_found_items",
        resource_type: "auto",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 
    }

    // C. SAVE TO DB
    const newItem = new Item({
      name,
      location,
      description,
      type,
      date: date || new Date().toISOString(),
      user: req.user.id,
      phone: phone || null,
      image: imageUrl,
      isAiVerified: aiStatus.isVerified 
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Error creating post" });
  }
});

// ✅ GET ALL ITEMS (Feed)
router.get("/all", async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name").sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET USER ITEMS
router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE ITEM
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (item.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await item.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE ITEM
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    if (item.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;




/*
import express from "express";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Item from "../models/Item.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import axios from "axios";

const router = express.Router();
dotenv.config();

// ---------------- AI CHAT ----------------
router.post("/ai/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(
      "https://api.sambanova.ai/v1/chat/completions",
      {
        model: "Meta-Llama-3.3-70B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant for a Lost and Found web application.",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Chatbot error" });
  }
});

// ---------------- AI LOST DESCRIPTION ----------------
router.post("/ai/lost-description", async (req, res) => {
  const { name, location } = req.body;

  try {
    const response = await fetch(
      "https://api.sambanova.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Meta-Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "user",
              content: `Lost item: ${name} near ${location}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json({ description: data.choices[0].message.content });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ---------------- AI FOUND DESCRIPTION ----------------
router.post("/ai/description", async (req, res) => {
  const { name, location } = req.body;

  try {
    const response = await fetch(
      "https://api.sambanova.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "Meta-Llama-3.1-8B-Instruct",
          messages: [
            {
              role: "user",
              content: `Found item: ${name} at ${location}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json({ description: data.choices[0].message.content });
  } catch {
    res.status(500).json({ message: "Failed" });
  }
});

// ---------------- CLOUDINARY ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

// ---------------- CREATE ITEM (WITH FLASK) ----------------
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, location, description, type, date, phone } = req.body;

    if (!name || !location || !type) {
      return res.status(400).json({ message: "Required fields missing" });
    }

   try {
  const flaskRes = await axios.post(
    "http://127.0.0.1:5001/check-post",
    {
      name: name,
      description: description,
      location: location,
    }
  );

  console.log("Flask response:", flaskRes.data); // 👈 HERE

  if (flaskRes.data.status === "fake") {
    return res.status(400).json({
      message: "Fake post detected",
    });
  }

} catch (err) {
  console.error("Flask error:", err.message);
  return res.status(500).json({
    message: "Flask server not running",
  });
}

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newItem = new Item({
      name,
      location,
      description,
      type,
      date: date || new Date(),
      user: req.user.id,
      phone,
      image: imageUrl,
    });

    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- GET USER ITEMS ----------------
router.get("/", verifyToken, async (req, res) => {
  const items = await Item.find({ user: req.user.id });
  res.json(items);
});

// ---------------- GET ALL ----------------
router.get("/all", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// ---------------- GET ONE ----------------
router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
});

// ---------------- DELETE ----------------
router.delete("/:id", verifyToken, async (req, res) => {
  const item = await Item.findById(req.params.id);
  await item.deleteOne();
  res.json({ message: "Deleted" });
});

// ---------------- UPDATE ----------------
router.put("/:id", verifyToken, async (req, res) => {
  const item = await Item.findById(req.params.id);
  Object.assign(item, req.body);
  const updated = await item.save();
  res.json(updated);
});

export default router;
*/