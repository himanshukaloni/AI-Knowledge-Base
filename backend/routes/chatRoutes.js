const express = require("express");
const { body } = require("express-validator");
const {
  askQuestion,
  askQuestionStream,
  getChats,
  getChatById,
  deleteChat,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect);

const askValidation = [
  body("question").trim().notEmpty().withMessage("Question is required"),
  body("chatId").optional().isMongoId().withMessage("Invalid chat id"),
];

router.post("/ask", askValidation, validateRequest, askQuestion);
router.post("/ask/stream", askValidation, validateRequest, askQuestionStream);
router.get("/", getChats);
router.get("/:id", getChatById);
router.delete("/:id", deleteChat);

module.exports = router;
