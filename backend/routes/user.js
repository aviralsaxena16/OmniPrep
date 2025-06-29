// routes/user.js
import express from "express";
import User from "../models/User.js";


const router = express.Router();

router.post("/store-user", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    console.error("Missing email or name");
    return res.status(400).json({ message: "Missing email or name" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
      console.log("User created:", user);
    }

    res.status(200).json({ message: "User synced", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    console.error(err);
  }
});


export default router;
