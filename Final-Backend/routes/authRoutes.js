// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");
// const upload = require("../utils/upload"); // IMPORTANT

// // REGISTER WITH AVATAR UPLOAD
// router.post("/register", upload.single("avatar"), authController.register);

// // LOGIN
// router.post("/login", authController.login);

// module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../utils/upload");
const auth = require("../middleware/authMiddleware"); // ADD THIS

// REGISTER WITH AVATAR UPLOAD
router.post("/register", upload.single("avatar"), authController.register);

// LOGIN
router.post("/login", authController.login);

// UPDATE PROFILE (NEW – DOES NOT TOUCH OLD ROUTES)
router.put("/update-profile", auth, authController.updateProfile);

module.exports = router;
