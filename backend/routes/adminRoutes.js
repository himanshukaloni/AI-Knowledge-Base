const express = require("express");
const {
  getAllUsers,
  getAllDocuments,
  getSystemAnalytics,
  deleteUser,
  deleteAnyDocument,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/documents", getAllDocuments);
router.get("/analytics", getSystemAnalytics);
router.delete("/users/:id", deleteUser);
router.delete("/documents/:id", deleteAnyDocument);

module.exports = router;
