/**
 * embeddingService.js
 *
 * Embedding generation using Google's unified @google/genai SDK.
 *
 * IMPORTANT: text-embedding-004 was fully deprecated and shut down by
 * Google on January 14, 2026 (the API now returns 404 for it - "models/
 * text-embedding-004 is not found for API version v1beta, or is not
 * supported for embedContent"). It has been replaced by gemini-embedding-001.
 *
 * gemini-embedding-001 defaults to 3072-dimensional output, but supports
 * Matryoshka Representation Learning (MRL), which lets you truncate the
 * vector to a smaller size via `outputDimensionality`. Google explicitly
 * documents 3072, 1536, and 768 as supported truncation sizes. We use 768
 * here specifically so this stays compatible with a MongoDB Atlas Vector
 * Search index already configured with numDimensions: 768 - no index
 * rebuild or re-embedding of unrelated fields required.
 *
 * If you point GEMINI_EMBEDDING_MODEL/EMBEDDING_DIMENSIONS at a different
 * model or dimension size, make sure your Atlas Vector Search index's
 * numDimensions matches, and re-embed all existing document chunks -
 * vectors of different dimensions cannot coexist in one index.
 *
 * Public API (unchanged, so callers like documentProcessingService.js and
 * ragService.js require no changes):
 *   - embedText(text)                         -> Promise<number[]>
 *   - embedChunksBatch(textChunks, batchSize)  -> Promise<number[][]>
 */

const { GoogleGenAI } = require("@google/genai");
const logger = require("../config/logger");

const GEMINI_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
const OUTPUT_DIMENSIONALITY = Number(process.env.EMBEDDING_DIMENSIONS) || 768;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const MAX_RETRIES = 3; // total attempts allowed for a single embedding request
const BASE_DELAY_MS = 1000; // base delay for exponential backoff (1s, 2s, 4s)

// Lazily instantiated singleton client - avoids constructing the client
// (and validating the API key) until the first embedding call actually happens.
let client = null;

/**
 * Returns a shared GoogleGenAI client instance, constructing it on first use.
 * Throws immediately if GEMINI_API_KEY is missing, so failures surface early
 * and clearly rather than as a cryptic SDK error deep in a request.
 */
function getClient() {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey"
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return client;
}

/**
 * Sleeps for the given number of milliseconds. Used between retry attempts.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Core embedding call against the @google/genai SDK, with retry logic.
 *
 * `contents` is always passed as an array of strings (even for a single
 * piece of text), since embedContent accepts a batch of contents in one
 * call and returns one embedding per content, in order. This lets
 * embedChunksBatch send an entire batch in a single request instead of
 * looping one-by-one, which is both faster and more efficient for
 * populating a MongoDB Atlas Vector Search collection.
 *
 * `taskType` tunes the embedding for its intended use:
 *   - "RETRIEVAL_QUERY"    -> for the user's question at search time
 *   - "RETRIEVAL_DOCUMENT" -> for document chunks being indexed
 *
 * `outputDimensionality` truncates gemini-embedding-001's native
 * 3072-dim vector down to OUTPUT_DIMENSIONALITY (768 by default).
 *
 * Retries up to MAX_RETRIES times with exponential backoff (1s, 2s, 4s)
 * on any failure (network errors, rate limits, transient API errors).
 */


async function embedWithRetry(contents, taskType, attempt = 1) {
  const genAI = getClient();

  try {
    const response = await genAI.models.embedContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        taskType,
        outputDimensionality: OUTPUT_DIMENSIONALITY,
      },
    });

    if (!response || !Array.isArray(response.embeddings) || response.embeddings.length === 0) {
      throw new Error("Gemini returned no embeddings in the response");
    }

    if (response.embeddings.length !== contents.length) {
      throw new Error(
        `Gemini returned ${response.embeddings.length} embeddings for ${contents.length} inputs`
      );
    }

    // Each embedding object exposes its vector as `.values` (array of numbers).
    return response.embeddings.map((embedding) => embedding.values);
  } catch (error) {
    const errorMessage = error?.message || String(error);
    const errorStatus = error?.status || error?.code || "";

    logger.error(
      `Gemini embedContent failed (attempt ${attempt}/${MAX_RETRIES}, model=${GEMINI_MODEL}, ` +
        `taskType=${taskType}, inputCount=${contents.length}): ${errorStatus} ${errorMessage}`
    );

    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1); // 1000ms, 2000ms, 4000ms
      logger.warn(`Retrying Gemini embedding request in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
      await sleep(delay);
      return embedWithRetry(contents, taskType, attempt + 1);
    }

    throw new Error(
      `Gemini embedding request failed after ${MAX_RETRIES} attempts: ${errorMessage}`
    );
  }
}

/**
 * Generates an embedding vector for a single piece of text.
 * Used for the user's question at query time (RETRIEVAL_QUERY), so the
 * resulting vector is optimized for matching against indexed document
 * chunks in MongoDB Atlas Vector Search.
 *
 * @param {string} text
 * @returns {Promise<number[]>} embedding vector
 */
async function embedText(text) {
  if (typeof text !== "string" || text.trim().length === 0) {
    throw new Error("embedText requires a non-empty string");
  }

  const [vector] = await embedWithRetry([text], "RETRIEVAL_QUERY");
  return vector;
}

/**
 * Generates embeddings for many document chunks, split into batches.
 * Used when ingesting a document (RETRIEVAL_DOCUMENT), so each vector is
 * optimized as something to be retrieved against, matching the query-side
 * embeddings produced by embedText.
 *
 * Batching (instead of one API call per chunk) keeps ingestion of large
 * documents fast and efficient, while still bounding each request to a
 * reasonable size for the API and for MongoDB Atlas Vector Search inserts.
 *
 * @param {string[]} textChunks - array of chunk texts to embed
 * @param {number} batchSize - number of chunks embedded per API call (default 20)
 * @returns {Promise<number[][]>} array of embedding vectors, in the same order as textChunks
 */
async function embedChunksBatch(textChunks, batchSize = 20) {
  if (!Array.isArray(textChunks) || textChunks.length === 0) {
    return [];
  }

  const embeddings = [];

  for (let i = 0; i < textChunks.length; i += batchSize) {
    const batch = textChunks.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;

    logger.debug(
      `Embedding batch ${batchNumber} (${batch.length} chunks) via Gemini (${GEMINI_MODEL})`
    );

    const batchEmbeddings = await embedWithRetry(batch, "RETRIEVAL_DOCUMENT");
    embeddings.push(...batchEmbeddings);
  }

  return embeddings;
}

module.exports = { embedText, embedChunksBatch };