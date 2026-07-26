const mongoose = require("mongoose");
const DocumentChunk = require("../models/DocumentChunk");
const groq = require("../config/groq");
const { embedText } = require("./embeddingService");
const ApiError = require("../utils/ApiError");

const CHAT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const VECTOR_INDEX_NAME = process.env.VECTOR_INDEX_NAME || "vector_index";
const TOP_K = 5;

const SYSTEM_PROMPT = `You are a helpful knowledge base assistant. You must answer the user's question
using ONLY the provided context extracted from their uploaded documents.

Rules:
- If the answer is not contained in the context, respond exactly with:
  "I couldn't find this information in your uploaded documents."
- Do not use outside knowledge or make assumptions beyond the given context.
- Be concise and directly answer the question.
- Do not mention "the context" or "the provided text" in your answer - answer naturally as if you know it.`;

/**
 * Runs Atlas Vector Search ($vectorSearch aggregation stage) to find the
 * most semantically similar chunks to the query embedding, scoped to the
 * requesting user's own documents only.
 */
async function retrieveRelevantChunks(queryEmbedding, ownerId, topK = TOP_K) {
  const results = await DocumentChunk.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX_NAME,
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: topK * 20,
        limit: topK,
        filter: { owner: new mongoose.Types.ObjectId(ownerId) },
      },
    },
    {
      $project: {
        text: 1,
        chunkIndex: 1,
        pageNumber: 1,
        document: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $lookup: {
        from: "documents",
        localField: "document",
        foreignField: "_id",
        as: "documentInfo",
      },
    },
    { $unwind: "$documentInfo" },
  ]);

  return results;
}

/**
 * Builds the final prompt sent to the Groq Chat Completions API,
 * injecting retrieved chunks as labeled context blocks so the model
 * can cite which chunk supported which part of the answer.
 */
function buildContextPrompt(chunks, question) {
  const contextBlocks = chunks
    .map(
      (chunk, i) =>
        `[Source ${i + 1} - ${chunk.documentInfo.originalName}]\n${chunk.text}`
    )
    .join("\n\n---\n\n");

  return `Context from uploaded documents:\n\n${contextBlocks}\n\n---\n\nQuestion: ${question}`;
}

/**
 * Full RAG query: embed question -> vector search -> build prompt -> chat completion -> format answer + sources.
 */
async function answerQuestion(question, ownerId) {
  const queryEmbedding = await embedText(question);
  const relevantChunks = await retrieveRelevantChunks(queryEmbedding, ownerId);

  if (relevantChunks.length === 0) {
    return {
      answer: "I couldn't find this information in your uploaded documents.",
      sources: [],
    };
  }

  const userPrompt = buildContextPrompt(relevantChunks, question);

  const completion = await groq.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2, // low temperature: prioritize faithfulness to context over creativity
  });

  const answer = completion.choices[0].message.content.trim();

  const sources = relevantChunks.map((chunk) => ({
    documentId: chunk.documentInfo._id,
    documentName: chunk.documentInfo.originalName,
    pageNumber: chunk.pageNumber,
    snippet: chunk.text.slice(0, 200) + (chunk.text.length > 200 ? "..." : ""),
    score: chunk.score,
  }));

  return { answer, sources };
}

/**
 * Streaming variant used by the chat controller for a ChatGPT-like typing effect.
 * Yields text deltas via the provided callback as they arrive from Groq.
 */
async function answerQuestionStream(question, ownerId, onToken) {
  const queryEmbedding = await embedText(question);
  const relevantChunks = await retrieveRelevantChunks(queryEmbedding, ownerId);

  if (relevantChunks.length === 0) {
    const fallback = "I couldn't find this information in your uploaded documents.";
    onToken(fallback);
    return { answer: fallback, sources: [] };
  }

  const userPrompt = buildContextPrompt(relevantChunks, question);

  const stream = await groq.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    stream: true,
  });

  let fullAnswer = "";
  for await (const part of stream) {
    const delta = part.choices[0]?.delta?.content || "";
    if (delta) {
      fullAnswer += delta;
      onToken(delta);
    }
  }

  const sources = relevantChunks.map((chunk) => ({
    documentId: chunk.documentInfo._id,
    documentName: chunk.documentInfo.originalName,
    pageNumber: chunk.pageNumber,
    snippet: chunk.text.slice(0, 200) + (chunk.text.length > 200 ? "..." : ""),
    score: chunk.score,
  }));

  return { answer: fullAnswer, sources };
}

module.exports = { answerQuestion, answerQuestionStream, retrieveRelevantChunks };
