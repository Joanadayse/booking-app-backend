import db from "../models/index.js";

const { Booking, Space, User  } = db;

export const getAllBookings = async (req, res) => {
  try {


const bookings = await Booking.findAll({
  include: [
    {
      model: Space,
      attributes: ['name', 'location']
    },
    {
      model: User,
      attributes: ['name', 'email']
    }
  ]
});


console.log(JSON.stringify(bookings, null, 2));



    res.json(bookings);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    res.status(500).json({ error: "Erro ao buscar reservas" });
  }
};


export const createBooking = async (req, res) => {
  try {
    console.log("📦 Dados recebidos no corpo da requisição:", req.body);
    const { title, description, date, turno, user_id, space_id } = req.body;

    // Validar campos obrigatórios
    if (!title || !date || !turno || !user_id || !space_id) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Definir horários conforme turno
    const turnos = {
      manhã: { start_time: "08:00", end_time: "12:00" },
      tarde: { start_time: "13:00", end_time: "17:00" },
      integral: { start_time: "08:00", end_time: "17:00" }
    };

    if (!turnos[turno]) {
      return res.status(400).json({ error: "Turno inválido!" });
    }

    const { start_time, end_time } = turnos[turno];

    // Criar a reserva com Sequelize, incluindo o campo turno
    const booking = await Booking.create({
      title,
      description,
      date,
      start_time,
      end_time,
      turno,   // <=== IMPORTANTE
      user_id,
      space_id
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    res.status(500).json({ error: "Erro ao criar reserva." });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    await booking.destroy();
    res.json({ message: "Reserva deletada com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao deletar reserva:", error);
    res.status(500).json({ error: "Erro ao deletar reserva." });
  }
};

export const getBookingsByLocation = async (req, res) => {
  try {
    const { location_id } = req.params;

    const bookings = await Booking.findAll({
      include: [
        {
          model: Space,
          attributes: ["name", "location"],
          where: { location: location_id === "1" ? "Caldeira" : "EQTLAB" }
        },
        {
          model: User,
          attributes: ["name"]
        }
      ]
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Erro ao buscar reservas:", error);
    res.status(500).json({ error: "Erro ao buscar reservas." });
  }
};

