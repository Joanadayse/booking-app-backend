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
  getStatsByLocation
} from "../controllers/booking.controller.js";

const router = express.Router();



router.get("/", getAllBookings);
router.get("/stats", getStats);
router.get("/stats/location/:location", getStatsByLocation);


// ROTAS ESPECÍFICAS PRIMEIRO
router.get('/filtro', getFilteredBookings);
router.get("/location/:location_id", getBookingsByLocation);

// ROTAS COM PARÂMETROS DEPOIS
router.get('/:id', getBookingById);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);
router.put("/:id", updateBooking);









export default router;

