import express from "express";
import { getAllBookings, createBooking, deleteBooking } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getAllBookings);
router.post("/", createBooking);
router.delete("/bookings/:id", deleteBooking);


export default router;
