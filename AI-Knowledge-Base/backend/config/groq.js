const Groq = require("groq-sdk");

/**
 * Single shared Groq client instance, used for chat completions only.
 * Groq's SDK mirrors the OpenAI client shape (chat.completions.create,
 * including streaming via `stream: true`), which is why swapping providers
 * only required changing this file + ragService.js's import.
 */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;
