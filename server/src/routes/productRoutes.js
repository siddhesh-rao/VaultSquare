const express = require("express");

const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  permanentlyDeleteProduct,
  checkAvailability
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/admin/all", protect, adminOnly, getAdminProducts);
router.get("/:id", getProductById);
router.get("/:id/availability", checkAvailability);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.delete("/:id/permanent", protect, adminOnly, permanentlyDeleteProduct);

module.exports = router;
