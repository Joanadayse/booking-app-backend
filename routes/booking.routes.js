import express from "express";
import {
  getAllBookings,
  createBooking,
  deleteBooking,
  getBookingsByLocation,
  updateBooking,
  getBookingById,
  getFilteredBookings,
  getStats,
  getStatsByLocation,
  getAvailabilityByLocationAndDate
} from "../controllers/booking.controller.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";


const router = express.Router();

// 🔒 Protegendo rotas com JWT
router.get("/", authenticateToken, getAllBookings);
router.get("/stats", authenticateToken, getStats);
router.get("/stats/location/:location", authenticateToken, getStatsByLocation);
router.get("/availability", authenticateToken, getAvailabilityByLocationAndDate);

router.get('/filtro', authenticateToken, getFilteredBookings);
router.get("/location/:location_id", authenticateToken, getBookingsByLocation);

router.get('/:id', authenticateToken, getBookingById);
router.post("/", authenticateToken, createBooking);
router.delete("/:id", authenticateToken, deleteBooking);
router.put("/:id", authenticateToken, updateBooking);

export default router;
