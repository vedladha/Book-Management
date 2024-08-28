const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const dashController = require("../controllers/dashController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authController.getLoginPage);
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotpassword);
router.post("/reset-password", authController.resetPassword);
router.get("/dashboard", authMiddleware, dashController.getDashboardPage);
router.get("/getProduct", authMiddleware, dashController.getProduct);
router.post("/createProduct", authMiddleware, dashController.createProduct);
router.put("/updateProduct/:id", authMiddleware, dashController.updateProduct);
router.delete(
  "/deleteProduct/:id",
  authMiddleware,
  dashController.deleteProduct
);

router.get("/forgot-password", authController.getForgotPassword);
router.get("/reset-password/:id", authController.getResetPassword);
module.exports = router;
