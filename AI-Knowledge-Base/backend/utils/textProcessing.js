/**
 * Manual text cleaning + chunking utilities.
 * Deliberately implemented from scratch (no LangChain TextSplitter)
 * so the RAG pipeline's core mechanics are transparent and controllable.
 */

/**
 * Cleans raw extracted text:
 * - Collapses excessive whitespace/newlines
 * - Removes non-printable/control characters
 * - Trims each line
 */
function cleanText(rawText) {
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/[^\x09\x0A\x20-\x7E\u00A0-\uFFFF]/g, "") // strip control chars, keep printable + unicode
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Splits cleaned text into overlapping chunks.
 *
 * Approach: character-based sliding window with overlap, aligned to sentence
 * boundaries when possible so chunks don't cut sentences in half.
 *
 * @param {string} text - cleaned text
 * @param {number} chunkSize - target size in characters (~ proxy for tokens)
 * @param {number} chunkOverlap - characters of overlap between consecutive chunks
 * @returns {string[]} array of text chunks
 */
function chunkText(text, chunkSize = 1000, chunkOverlap = 150) {
  if (!text || text.length === 0) return [];
  if (chunkOverlap >= chunkSize) {
    throw new Error("chunkOverlap must be smaller than chunkSize");
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

    // Try to end the chunk at a sentence boundary (., !, ?, newline) rather
    // than mid-word, by searching backward from `end` within a small window.
    if (end < text.length) {
      const searchWindow = text.slice(Math.max(start, end - 200), end);
      const lastBoundary = Math.max(
        searchWindow.lastIndexOf(". "),
        searchWindow.lastIndexOf("!\n"),
        searchWindow.lastIndexOf("?\n"),
        searchWindow.lastIndexOf("\n")
      );
      if (lastBoundary !== -1) {
        end = Math.max(start, end - 200) + lastBoundary + 1;
      }
    }

    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);

    if (end >= text.length) break;
    start = end - chunkOverlap; // step forward, keeping overlap for context continuity
  }

  return chunks;
}

/**
 * Rough token estimator (LLM tokenizers average ~4 chars/token for English).
 * Used only for logging/heuristics, not billing-accurate.
 */
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

module.exports = { cleanText, chunkText, estimateTokens };
