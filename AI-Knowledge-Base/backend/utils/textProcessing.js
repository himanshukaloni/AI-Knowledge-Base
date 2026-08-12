
function cleanText(rawText) {
  return rawText
    .replace(/\r\n/g, "\n")
    .replace(/[^\x09\x0A\x20-\x7E\u00A0-\uFFFF]/g, "") 
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}


function chunkText(text, chunkSize = 1000, chunkOverlap = 150) {
  if (!text || text.length === 0) return [];
  if (chunkOverlap >= chunkSize) {
    throw new Error("chunkOverlap must be smaller than chunkSize");
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

   
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
    start = end - chunkOverlap; 
  }

  return chunks;
}

function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

module.exports = { cleanText, chunkText, estimateTokens };
