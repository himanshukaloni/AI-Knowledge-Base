const fs = require("fs/promises");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const ApiError = require("../utils/ApiError");

/**
 * Extracts raw text from an uploaded file based on its detected type.
 * Returns { text, pageCount } - pageCount is only meaningful for PDFs.
 */
async function extractText(filePath, fileType) {
  const buffer = await fs.readFile(filePath);

  switch (fileType) {
    case "pdf": {
      const data = await pdfParse(buffer);
      return { text: data.text, pageCount: data.numpages || null };
    }
    case "docx": {
      const result = await mammoth.extractRawText({ buffer });
      return { text: result.value, pageCount: null };
    }
    case "txt": {
      return { text: buffer.toString("utf-8"), pageCount: null };
    }
    default:
      throw new ApiError(400, `Unsupported file type: ${fileType}`);
  }
}

module.exports = { extractText };
