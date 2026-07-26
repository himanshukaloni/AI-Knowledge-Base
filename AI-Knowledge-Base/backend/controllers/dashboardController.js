const Document = require("../models/Document");
const Chat = require("../models/Chat");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboardStats = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;

  const [totalDocuments, processedDocuments, chats, recentUploads] = await Promise.all([
    Document.countDocuments({ owner: ownerId }),
    Document.countDocuments({ owner: ownerId, status: "processed" }),
    Chat.find({ owner: ownerId }).select("messages updatedAt title"),
    Document.find({ owner: ownerId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const totalQuestions = chats.reduce((sum, chat) => sum + chat.messages.length, 0);

  const recentChats = [...chats]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)
    .map((chat) => ({
      _id: chat._id,
      title: chat.title,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length,
    }));

  res.status(200).json(
    new ApiResponse(200, {
      stats: {
        totalDocuments,
        processedDocuments,
        totalQuestions,
        totalConversations: chats.length,
      },
      recentUploads,
      recentChats,
    })
  );
});

module.exports = { getDashboardStats };
