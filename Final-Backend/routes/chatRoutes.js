const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

router.post("/start", auth, chatController.startChat);
router.get("/", auth, chatController.getMyChats);
router.get("/:chatId/messages", auth, chatController.getMessages);
router.post("/:chatId/messages", auth, chatController.sendMessage);
router.delete("/:chatId", auth, chatController.deleteChat);

module.exports = router;
