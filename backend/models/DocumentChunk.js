const mongoose = require("mongoose");

/**
 * Each chunk stores its own embedding vector.
 * An Atlas Vector Search index must be created on the `embedding` field
 * (see README for the exact index definition) for $vectorSearch to work.
 */
const documentChunkSchema = new mongoose.Schema(
  {
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true },
    chunkIndex: { type: Number, required: true },
    pageNumber: { type: Number, default: null }, // available for PDFs when derivable
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocumentChunk", documentChunkSchema);
