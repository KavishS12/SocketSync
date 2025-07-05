import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getUsers, getMessages, sendMessage, editMessage, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id",protectRoute,getMessages);
router.post("/send-message/:id", protectRoute,sendMessage);
router.put("/edit/:messageId", protectRoute, editMessage);
router.delete("/delete/:messageId", protectRoute, deleteMessage);

export default router;