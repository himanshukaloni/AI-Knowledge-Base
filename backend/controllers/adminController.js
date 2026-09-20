const User = require("../models/User");
const Document = require("../models/Document");
const DocumentChunk = require("../models/DocumentChunk");
const Chat = require("../models/Chat");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

const getAllDocuments = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  const [documents, total] = await Promise.all([
    Document.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Document.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      documents,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

const getSystemAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalDocuments, totalChunks, totalChats, statusBreakdown] = await Promise.all([
    User.countDocuments(),
    Document.countDocuments(),
    DocumentChunk.countDocuments(),
    Chat.countDocuments(),
    Document.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const chats = await Chat.find().select("messages");
  const totalQuestions = chats.reduce((sum, chat) => sum + chat.messages.length, 0);

  res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalDocuments,
      totalChunks,
      totalConversations: totalChats,
      totalQuestions,
      documentStatusBreakdown: statusBreakdown,
    })
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "admin") throw new ApiError(400, "Cannot delete an admin account");

  const userDocs = await Document.find({ owner: user._id });
  const docIds = userDocs.map((d) => d._id);

  await Promise.all([
    DocumentChunk.deleteMany({ document: { $in: docIds } }),
    Document.deleteMany({ owner: user._id }),
    Chat.deleteMany({ owner: user._id }),
    user.deleteOne(),
  ]);

  res.status(200).json(new ApiResponse(200, null, "User and all associated data deleted"));
});

const deleteAnyDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  if (!document) throw new ApiError(404, "Document not found");

  await DocumentChunk.deleteMany({ document: document._id });
  await document.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Document deleted"));
});

module.exports = {
  getAllUsers,
  getAllDocuments,
  getSystemAnalytics,
  deleteUser,
  deleteAnyDocument,
};
