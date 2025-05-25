import express from "express";
import {
  getAllBookings,
  createBooking,
  deleteBooking,
  getBookingsByLocation,
  updateBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", getAllBookings);
router.post("/", createBooking);
router.delete('/:id', deleteBooking);
router.get("/location/:location_id", getBookingsByLocation);
router.put('/:id', updateBooking); 
export default router;

