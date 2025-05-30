import express from "express";
import { getUser, login } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/user", authenticateToken, getUser);


export default router;
