const Document = require("../models/Document");
const DocumentChunk = require("../models/DocumentChunk");
const { extractText } = require("./textExtractionService");
const { cleanText, chunkText, estimateTokens } = require("../utils/textProcessing");
const { embedChunksBatch } = require("./embeddingService");
const logger = require("../config/logger");

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

/**
 * Full ingestion pipeline for a single uploaded document:
 * extract -> clean -> chunk -> embed -> persist chunks -> update document status.
 *
 * Runs asynchronously after the upload response has already been sent to
 * the client, so large files don't block the HTTP request.
 */
async function processDocument(documentId) {
  const document = await Document.findById(documentId);
  if (!document) {
    logger.error(`processDocument: document ${documentId} not found`);
    return;
  }

  try {
    document.status = "processing";
    await document.save();

    const { text: rawText } = await extractText(document.storagePath, document.fileType);
    const cleaned = cleanText(rawText);

    if (!cleaned || cleaned.length < 20) {
      throw new Error("No meaningful text could be extracted from this document");
    }

    const chunks = chunkText(cleaned, CHUNK_SIZE, CHUNK_OVERLAP);
    if (chunks.length === 0) {
      throw new Error("Text chunking produced zero chunks");
    }

    const embeddings = await embedChunksBatch(chunks);

    const chunkDocs = chunks.map((chunkTextValue, index) => ({
      document: document._id,
      owner: document.owner,
      text: chunkTextValue,
      chunkIndex: index,
      pageNumber: null, // per-page mapping is a documented future enhancement (see README)
      embedding: embeddings[index],
    }));

    await DocumentChunk.insertMany(chunkDocs);

    document.status = "processed";
    document.chunkCount = chunks.length;
    document.totalTokensEstimate = chunks.reduce((sum, c) => sum + estimateTokens(c), 0);
    document.processingError = null;
    await document.save();

    logger.info(`Document ${documentId} processed: ${chunks.length} chunks created`);
  } catch (error) {
    document.status = "failed";
    document.processingError = error.message;
    await document.save();
    logger.error(`Document ${documentId} processing failed: ${error.message}`);
  }
}

module.exports = { processDocument };
