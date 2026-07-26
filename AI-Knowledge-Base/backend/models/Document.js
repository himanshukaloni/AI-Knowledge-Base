const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    fileSize: { type: Number, required: true }, // bytes
    fileType: { type: String, enum: ["pdf", "docx", "txt"], required: true },
    storagePath: { type: String, required: true }, // path on disk (local storage)
    status: {
      type: String,
      enum: ["uploaded", "processing", "processed", "failed"],
      default: "uploaded",
    },
    processingError: { type: String, default: null },
    chunkCount: { type: Number, default: 0 },
    totalTokensEstimate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

documentSchema.index({ owner: 1, createdAt: -1 });
documentSchema.index({ originalName: "text" }); // enables text search on filename

module.exports = mongoose.model("Document", documentSchema);
