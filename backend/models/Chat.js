const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    documentName: String,
    pageNumber: Number,
    snippet: String,
    score: Number,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    sources: { type: [sourceSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New Conversation" },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

chatSchema.index({ owner: 1, updatedAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
