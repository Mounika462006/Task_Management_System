const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // Pre-hashed with bcrypt before persisting
    },
    otpHash: {
      type: String,
      required: true, // SHA-256 hashed
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: automatically deletes document when expiresAt arrives
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastResendAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema);

module.exports = PendingRegistration;
