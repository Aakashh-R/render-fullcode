import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_secret";
export const register = async (req, res) => {
  try {
    const { name, email, password, companyName, role } = req.body;
    if (!email || !password || !companyName || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Invalid email" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, companyName, role });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ success: true, user: { name: user.name, email: user.email, companyName: user.companyName, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing credentials" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, user: { name: user.name, email: user.email, companyName: user.companyName, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};