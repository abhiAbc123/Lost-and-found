
import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import authAdmin from "../middleware/authAdmin.js";
import User from "../models/User.js";
import Item from "../models/Item.js";

const router = express.Router();


const ADMIN_CODE = "777";
// Admin signup

router.post("/signup", async (req, res) => {
  const { name, email, password, adminCode } = req.body;
 console.log("Received adminCode:", adminCode); 
  try {
    if (adminCode !== ADMIN_CODE) {
      return res.status(400).json({ message: "Invalid admin code" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({ admin, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Admin login

router.post("/login", async (req, res) => {
  const { email, password, adminCode } = req.body;

  try {
    if (adminCode !== ADMIN_CODE) {
      return res.status(400).json({ message: "Invalid admin code" });
    }

     const admin = await Admin.findOne({ email });
     if (!admin) return res.status(400).json({ message: "Invalid credentials" });

     const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.json({ admin, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/users", authAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all items with user info populated
router.get("/items", authAdmin, async (req, res) => {
  try {
    const items = await Item.find().populate("user", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/users/:id", authAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete item
router.delete("/items/:id", authAdmin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item
router.put("/items/:id", authAdmin, async (req, res) => {
  try {
    const { name, type, location } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, type, location },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user
router.put("/users/:id", authAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;