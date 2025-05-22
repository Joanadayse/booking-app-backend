import express from "express";
import { getAllBookings, createBooking, deleteBooking, getBookingsByLocation } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getAllBookings);
router.post("/", createBooking);
router.delete("/bookings/:id", deleteBooking);
router.get("/location/:location_id", getBookingsByLocation);


export default router;
