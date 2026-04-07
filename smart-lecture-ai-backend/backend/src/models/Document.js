const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },       // bytes
    fileType: { type: String, default: "pdf" },   // pdf | docx | txt
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "failed"],
      default: "uploading",
    },
    errorMessage: { type: String, default: "" },
    chunkCount: { type: Number, default: 0 },
    totalWords: { type: Number, default: 0 },
    // Chat history for this document
    chatHistory: [
      {
        role: { type: String, enum: ["user", "assistant"] },
        content: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
