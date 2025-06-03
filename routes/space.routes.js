import express from "express";
import { getAllSpaces, createSpace, deleteSpace } from "../controllers/space.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticateToken);

router.get("/", getAllSpaces);
router.post("/", createSpace);
router.delete("/:id", authenticateToken, deleteSpace);


export default router;