const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createOrUpdateProductReview,
  getProductReviews,
  deleteProductReview,
  getAdminProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

//Get all the product
router.route("/products").get(getAllProducts);

//Get all the products -- Admin
router.route("/admin/products").get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts)

//create a product -- Admin
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

//Update and delete a product -- Admin
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct)

//Get a single product details by its id
router.route("/product/:id").get(getProductDetails);

router.route("/reviews").put(isAuthenticatedUser, createOrUpdateProductReview);

router.route("/review").get(getProductReviews).delete(isAuthenticatedUser, deleteProductReview);
module.exports = router;
