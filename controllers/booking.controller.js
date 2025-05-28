import { Op } from "sequelize";
import db from "../models/index.js";
import { Sequelize } from "sequelize";





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
      ],
      order: [
        ['date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

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
    if (isNaN(space_id) || isNaN(user_id)) {
  return res.status(400).json({ error: "IDs devem ser numéricos." });
}


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

    // Mapear o location_id para o nome da localização
    const locationMap = {
      "1": "Caldeira",
      "2": "EQTLab"
    };

    const locationName = locationMap[location_id];

    if (!locationName) {
      return res.status(400).json({ error: "Localização inválida" });
    }

    const bookings = await Booking.findAll({
      include: [
        {
          model: Space,
          attributes: ["name", "location"],
          where: { location: locationName }  // Filtra pelo nome da localização
        },
        {
          model: User,
          attributes: ["name"]
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    return res.json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar reservas por localização" });
  }
};


export const updateBooking = async (req, res) => {
  console.log("UpdateBooking chamada com id:", req.params.id);
   console.log("UpdateBooking chamada com id:", req.params.id);
  console.log("Dados recebidos no update:", req.body);
  try {
    const { id } = req.params;
    const { title, description, date, turno, user_id, space_id } = req.body;

    // Verifica se a reserva existe
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    // Validação básica dos campos obrigatórios
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

    // Atualiza os campos da reserva
    booking.title = title;
    booking.description = description;
    booking.date = date;
    booking.turno = turno;
    booking.start_time = start_time;
    booking.end_time = end_time;
    booking.user_id = user_id;
    booking.space_id = space_id;

    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    res.status(500).json({ error: "Erro ao atualizar reserva." });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingId = Number(id);

    if (isNaN(bookingId)) {
      return res.status(400).json({ error: "ID inválido." });
    }

    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Space, attributes: ['name', 'location'] },
        { model: User, attributes: ['name', 'email'] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    res.json(booking);
  } catch (error) {
    console.error("Erro ao buscar reserva por ID:", error);
    res.status(500).json({ error: "Erro ao buscar reserva por ID." });
  }
};



export const getFilteredBookings = async (req, res) => { 
  try {
    const { startDate, endDate, turno, spaceId, spaceName } = req.query;

    const where = {};

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    if (turno) {
      where.turno = turno;
    }

    if (spaceId) {
      where.space_id = Number(spaceId);
    }

    const includeSpace = {
      model: Space,
      attributes: ["name", "location"],
    };

    if (spaceName) {
  includeSpace.where = {
    name: {
      [Op.iLike]: `%${spaceName}%` // para buscar nomes parcialmente, insensível a maiúsculas/minúsculas
    }
  };
}

    const bookings = await Booking.findAll({
      where,
      include: [
        includeSpace,
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["date", "ASC"]],
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Erro ao buscar reservas com filtro:", error);
    res.status(500).json({ error: "Erro ao buscar reservas." });
  }
};


export const getStats = async (req, res) => {
  try {
    const totalReservasPorSala = await Booking.findAll({
      attributes: [
        "space_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("space_id")), "total"]
      ],
      group: ["space_id", "Space.id", "Space.name"],
      include: [{ model: Space, attributes: ["id", "name"] }]
    });



    const totalReservasPorTurno = await Booking.findAll({
      attributes: [
        "turno",
        [db.sequelize.fn("COUNT", db.sequelize.col("turno")), "total"]
      ],
      group: ["turno"]
    });
const totalReservasPorMes = await Booking.findAll({
  attributes: [
    [db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date")), "mes"], 
    [db.sequelize.fn("COUNT", db.sequelize.col("Booking.id")), "total"] // 🔹 Especificando Booking.id
  ],
  group: [db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date"))], // 🔹 Ajustando GROUP BY corretamente
  order: [[db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date")), "ASC"]],
  include: [{ model: Space, attributes: [], where: { location } }] // 🔹 Filtrando pelo Location
});


    res.json({ totalReservasPorSala, totalReservasPorTurno, totalReservasPorMes });
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
};


export const getStatsByLocation = async (req, res) => {
  try {
    const { location } = req.params; // 🔹 Captura o parâmetro da URL

const totalReservasPorSala = await Booking.findAll({
  // attributes: [
  //   "Booking.space_id",
  //   [db.sequelize.fn("COUNT", db.sequelize.col("Booking.space_id")), "total"]
  // ],
  attributes: [
  "space_id",
  [db.sequelize.fn("COUNT", db.sequelize.col("space_id")), "total"]
],
  group: ["Booking.space_id", "Space.id", "Space.name"], // 🔹 Especificando Booking corretamente
  include: [{ model: Space, attributes: ["id", "name"], where: { location } }]
});

    const totalReservasPorTurno = await Booking.findAll({
      attributes: ["turno", [db.sequelize.fn("COUNT", db.sequelize.col("turno")), "total"]],
      group: ["turno"],
      include: [
        { model: Space, attributes: [], where: { location } } // 🔹 Filtra pelo location
      ]
    });


    const totalReservasPorMes = await Booking.findAll({
  attributes: [
    [db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date")), "mes"], 
    [db.sequelize.fn("COUNT", db.sequelize.col("Booking.id")), "total"] // 🔹 Especificando Booking.id
  ],
  group: [db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date"))], // 🔹 Ajustando GROUP BY corretamente
  order: [[db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date")), "ASC"]],
  include: [{ model: Space, attributes: [], where: { location } }] // 🔹 Filtrando pelo Location
});

    res.json({ totalReservasPorSala, totalReservasPorTurno, totalReservasPorMes });
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
};





