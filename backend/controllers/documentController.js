const fs = require("fs/promises");
const path = require("path");
const Document = require("../models/Document");
const DocumentChunk = require("../models/DocumentChunk");
const { processDocument } = require("../services/documentProcessingService");
const { ALLOWED_MIME_TYPES } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const fileType = ALLOWED_MIME_TYPES[req.file.mimetype];

  const document = await Document.create({
    owner: req.user._id,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    fileSize: req.file.size,
    fileType,
    storagePath: req.file.path,
    status: "uploaded",
  });

  processDocument(document._id).catch((err) => {
  });

  res.status(201).json(new ApiResponse(201, { document }, "Document uploaded, processing started"));
});

const getDocuments = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const search = req.query.search || "";

  const query = { owner: req.user._id };
  if (search) {
    query.originalName = { $regex: search, $options: "i" };
  }

  const [documents, total] = await Promise.all([
    Document.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Document.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      documents,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  );
});

const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id });
  if (!document) throw new ApiError(404, "Document not found");
  res.status(200).json(new ApiResponse(200, { document }));
});

const downloadDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id });
  if (!document) throw new ApiError(404, "Document not found");

  res.download(document.storagePath, document.originalName);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, owner: req.user._id });
  if (!document) throw new ApiError(404, "Document not found");

  await DocumentChunk.deleteMany({ document: document._id });

  try {
    await fs.unlink(document.storagePath);
  } catch (err) {
  }

  await document.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Document deleted successfully"));
});

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  downloadDocument,
  deleteDocument,
};
