import express from "express";
import { getAllSpaces, createSpace } from "../controllers/space.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", getAllSpaces);
router.post("/", createSpace);


export default router;