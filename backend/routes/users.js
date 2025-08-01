const express = require("express");
const { User, Candidate, Leave } = require("../models/userModel");
const path = require("path");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const router = express.Router();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.post("/adminregister", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await new User({
      fullname,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).json({ success: true, data: savedUser });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password.toString(), user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000,
    secure: true,
    sameSite: "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.post("/candidatecreate", upload.single("resume"), async (req, res) => {
  try {
    const { fullname, email, phone, position, experience } = req.body;
    const resume = req.file?.filename || null;

    const candidate = new Candidate({
      fullname,
      email,
      phone,
      position,
      experience,
      resume,
    });

    const saved = await candidate.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Candidate create error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/allcandidatedata", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    console.error("Fetch candidates error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/candidatesearch/:value", async (req, res) => {
  const value = req.params.value;
  try {
    const filteredCandidates = await Candidate.find({
      fullname: { $regex: value, $options: "i" },
    });
    res.status(200).json(filteredCandidates);
  } catch (error) {
    console.error("Candidate search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while searching candidates",
    });
  }
});

router.delete("/candidatedelete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(id);
    if (!deletedCandidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/update-status", async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res
      .status(400)
      .json({ success: false, message: "Missing id or status" });
  }

  try {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    res.json({ success: true, data: candidate });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/position-update", async (req, res) => {
  const { id, position } = req.body;

  if (!id || !position) {
    return res
      .status(400)
      .json({ success: false, message: "Missing id or status" });
  }

  try {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { position },
      { new: true }
    );
    if (!position) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    res.json({ success: true, data: candidate });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/department-update", async (req, res) => {
  const { id, department } = req.body;

  if (!id || !department) {
    return res
      .status(400)
      .json({ success: false, message: "Missing id or department" });
  }

  try {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { department },
      { new: true }
    );

    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    res.json({ success: true, data: candidate });
  } catch (err) {
    console.error("Error updating department:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Failed to fetch candidates" });
  }
});

router.get("/candidatesome/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/candidateeditdata/:id", async (req, res) => {
  const { id } = req.params;
  const { fullname, email, phone, position, experience } = req.body;

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      id,
      {
        fullname,
        email,
        phone,
        position,
        experience,
      },
      { new: true }
    );

    if (!updatedCandidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    return res.status(200).json({ success: true, data: updatedCandidate });
  } catch (err) {
    console.error("Candidate update error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/leavepost", upload.single("document"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File missing" });
  }

  const { employeename, designation, leavedate, reason } = req.body;
  const document = req.file.filename;

  const newLeave = new Leave({
    employeename,
    designation,
    leavedate,
    reason,
    document,
  });

  await newLeave.save();
  res.status(200).json({ message: "Leave submitted successfully." });
});

router.get("/leavesdata", async (req, res) => {
  try {
    const allLeaves = await Leave.find();
    res.json(allLeaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
});

router.post("/leave-approve", async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res
      .status(400)
      .json({ success: false, message: "Missing id or status" });
  }

  try {
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    res.json({ success: true, data: updatedLeave });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
