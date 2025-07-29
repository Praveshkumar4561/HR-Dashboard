const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CandidateSchema = new Schema({
  fullname: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true },
  phone: { type: String },
  position: { type: String },
  experience: { type: String },
  status: { type: String },
  position: { type: String },
  department: { type: String },
  resume: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const LeaveSchema = new Schema({
  employeename: { type: String, required: true },
  designation: { type: String, required: true },
  leavedate: { type: String },
  reason: { type: String },
  status: { type: String },
  document: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = model("User", UserSchema);
const Candidate = model("Candidate", CandidateSchema);
const Leave = model("Leave", LeaveSchema);

module.exports = {
  User,
  Candidate,
  Leave,
};