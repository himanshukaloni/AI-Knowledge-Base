const Chat = require("../models/Chat");
const { answerQuestion, answerQuestionStream } = require("../services/ragService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Non-streaming ask endpoint (simple request/response, used as a fallback
 * or for API consumers that don't need streaming).
 */
const askQuestion = asyncHandler(async (req, res) => {
  const { question, chatId } = req.body;

  const { answer, sources } = await answerQuestion(question, req.user._id);

  let chat;
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, owner: req.user._id });
    if (!chat) throw new ApiError(404, "Conversation not found");
  } else {
    chat = await Chat.create({
      owner: req.user._id,
      title: question.slice(0, 60),
    });
  }

  chat.messages.push({ question, answer, sources });
  await chat.save();

  res.status(200).json(new ApiResponse(200, { answer, sources, chatId: chat._id }));
});

/**
 * Streaming ask endpoint using Server-Sent Events (SSE).
 * The frontend reads this via EventSource / fetch + ReadableStream to render
 * a token-by-token typing effect, matching the ChatGPT-style UX requirement.
 */
const askQuestionStream = asyncHandler(async (req, res) => {
  const { question, chatId } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const { answer, sources } = await answerQuestionStream(question, req.user._id, (token) => {
      sendEvent("token", { token });
    });

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, owner: req.user._id });
      if (!chat) throw new ApiError(404, "Conversation not found");
    } else {
      chat = await Chat.create({ owner: req.user._id, title: question.slice(0, 60) });
    }

    chat.messages.push({ question, answer, sources });
    await chat.save();

    sendEvent("done", { sources, chatId: chat._id });
  } catch (error) {
    sendEvent("error", { message: error.message || "Something went wrong" });
  } finally {
    res.end();
  }
});

const getChats = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);

  const [chats, total] = await Promise.all([
    Chat.find({ owner: req.user._id })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("title updatedAt createdAt messages"),
    Chat.countDocuments({ owner: req.user._id }),
  ]);

  // Return a lightweight preview list (last message only) for the sidebar
  const chatPreviews = chats.map((chat) => ({
    _id: chat._id,
    title: chat.title,
    updatedAt: chat.updatedAt,
    lastMessage: chat.messages[chat.messages.length - 1] || null,
    messageCount: chat.messages.length,
  }));

  res.status(200).json(
    new ApiResponse(200, {
      chats: chatPreviews,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

const getChatById = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, owner: req.user._id });
  if (!chat) throw new ApiError(404, "Conversation not found");
  res.status(200).json(new ApiResponse(200, { chat }));
});

const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, owner: req.user._id });
  if (!chat) throw new ApiError(404, "Conversation not found");
  await chat.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Conversation deleted"));
});

module.exports = { askQuestion, askQuestionStream, getChats, getChatById, deleteChat };
