import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/userprofile", verifyToken, async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const userId = req.user;
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists && emailExists.id !== userId) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ username, email, role });
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const user = await User.findAll({ attributes: { exclude: ["password"] } });
    if (!user) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteuser/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
