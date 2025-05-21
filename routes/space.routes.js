import express from "express";
import { getAllSpaces, createSpace } from "../controllers/space.controller.js";

const router = express.Router();

router.get("/", getAllSpaces);
router.post("/", createSpace);

export default router;