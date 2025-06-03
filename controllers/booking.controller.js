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

    if (isNaN(space_id) || isNaN(user_id)) {
      return res.status(400).json({ error: "IDs devem ser numéricos." });
    }

    console.log("🔍 Verificando reservas existentes para:", { date, space_id });

    // Função para verificar conflito de turno igual ao frontend


const normalizeTurno = (turno) => turno.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const haConflitoDeTurno = (turnoNovo, turnoExistente) => {
  const turnosEquivalentes = {
    manha: ["manha", "integral"],
    tarde: ["tarde", "integral"],
    integral: ["manha", "tarde", "integral"]
  };

  const novo = normalizeTurno(turnoNovo);
  const existente = normalizeTurno(turnoExistente);

  console.log(`🆚 Comparação de conflito no back-end: novo = ${novo}, existente = ${existente}`);

  // 🔄 Agora inclui conflitos com turnos iguais
  return turnosEquivalentes[novo]?.includes(existente);
};



// Buscar todas as reservas para mesma data e espaço
// Buscar todas as reservas para mesma data e espaço, sem filtro de turno
const reservasExistentes = await Booking.findAll({
  where: {
    date: date.trim(),
    space_id: Number(space_id)
  }
});

// Verificar se existe conflito com qualquer uma delas
const existeConflito = reservasExistentes.some(reserva => {
  const result = haConflitoDeTurno(turno, reserva.turno);
  console.log(`⚖️ Comparando turno ${turno} com ${reserva.turno} => Conflito? ${result}`);
  return result;
});

if (existeConflito) {
  console.log("⚠️ Conflito de reserva detectado.");
  return res.status(409).json({
    error: "Já existe uma reserva para esse espaço, data e turno conflitante."
  });
}


    // Definir horários conforme turno
const turnos = {
  manha: { start_time: "08:00", end_time: "12:00" },
  tarde: { start_time: "13:00", end_time: "17:00" },
  integral: { start_time: "08:00", end_time: "17:00" }
};



const turnoNormalizado = normalizeTurno(turno);

if (!turnos[turnoNormalizado]) {
  return res.status(400).json({ error: "Turno inválido!" });
}

const { start_time, end_time } = turnos[turnoNormalizado];

console.log("⛔ NÃO deveria chegar aqui se há conflito!");



    // Criar reserva
    const booking = await Booking.create({
      title,
      description,
      date: date.trim(),
      start_time,
      end_time,
      turno: turnoNormalizado,
      user_id: Number(user_id),
      space_id: Number(space_id)
    });

    res.status(201).json(booking);

  } catch (error) {
    console.error("❌ Erro ao criar reserva:", error.message);
    console.error("📄 Stack do erro:", error.stack);
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
      "2": "EQTLAB"
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
  console.log("Dados recebidos no update:", req.body);

  try {
    const { id } = req.params;
    const { title, description, date, turno, user_id, space_id } = req.body;

    // Verifica se a reserva existe
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada." });
    }

    if (!title || !date || !turno || !user_id || !space_id) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Função de normalização
    const normalizeTurno = (turno) =>
      turno.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const turnos = {
      manha: { start_time: "08:00", end_time: "12:00" },
      tarde: { start_time: "13:00", end_time: "17:00" },
      integral: { start_time: "08:00", end_time: "17:00" }
    };

    const turnoNormalizado = normalizeTurno(turno);

    if (!turnos[turnoNormalizado]) {
      return res.status(400).json({ error: "Turno inválido!" });
    }

    const { start_time, end_time } = turnos[turnoNormalizado];

    // 🔒 Verifica se o espaço já está reservado para esse turno e data (ignorando a própria reserva)
    const conflictingBooking = await Booking.findOne({
      where: {
        space_id,
        date,
        turno: turnoNormalizado,
        id: { [Op.ne]: booking.id } // ignora a reserva que estamos atualizando
      }
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: "Esse espaço já está reservado nesse dia e turno." });
    }

    // Atualiza os campos
    booking.title = title;
    booking.description = description;
    booking.date = date;
    booking.turno = turnoNormalizado;
    booking.start_time = start_time;
    booking.end_time = end_time;
    booking.user_id = user_id;
    booking.space_id = space_id;

    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error("❌ Erro ao atualizar reserva:", error.message);
    console.error("📄 Stack:", error.stack);
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
    // 🔍 Depuração para verificar o conteúdo de req.query no Railway
    console.log("✅ req.query recebido no Railway:", req.query);

    // 🔹 Garante que location está definido corretamente
    const location = req.query.location ? req.query.location.trim() : undefined;

    // 🔹 Se location não existir, `whereSpace` será `undefined`, evitando erros no Sequelize
    const whereSpace = location ? { location } : undefined;

    // 📊 Buscar total de reservas por sala
    const totalReservasPorSala = await Booking.findAll({
      attributes: [
        "space_id",
        [db.sequelize.fn("COUNT", db.sequelize.col("space_id")), "total"]
      ],
      group: ["space_id", "Space.id", "Space.name"],
      include: [{ model: Space, attributes: ["id", "name"] }]
    });

    // 📊 Buscar total de reservas por turno
    const totalReservasPorTurno = await Booking.findAll({
      attributes: [
        "turno",
        [db.sequelize.fn("COUNT", db.sequelize.col("turno")), "total"]
      ],
      group: ["turno"]
    });

    // 📊 Buscar total de reservas por mês
    const totalReservasPorMes = await Booking.findAll({
      attributes: [
        [db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date")), "mes"],
        [db.sequelize.fn("COUNT", db.sequelize.col("Booking.id")), "total"]
      ],
      group: [db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date"))],
      order: [[db.sequelize.fn("DATE_TRUNC", "month", db.sequelize.col("Booking.date")), "ASC"]],
      include: [{
        model: Space,
        attributes: [],
        where: whereSpace // 🔹 Garantimos que `whereSpace` está correto
      }]
    });

    // 🚀 Retornando os dados corretamente
    res.json({ totalReservasPorSala, totalReservasPorTurno, totalReservasPorMes });

  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error.message);
    console.error("📄 Stack do erro:", error.stack);
    res.status(500).json({ error: "Erro ao buscar estatísticas." });
  }
};



export const getStatsByLocation = async (req, res) => {
  try {
    const { location = null } = req.query;


const totalReservasPorSala = await Booking.findAll({

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

export const getAvailabilityByLocationAndDate = async (req, res) => {
  try {
    const { location, date, turno } = req.query;

    if (!location || !date || !turno) {
      return res.status(400).json({ error: "Parâmetros 'location', 'date' e 'turno' são obrigatórios." });
    }

    const turnoBusca = turno.trim().toLowerCase();

    const spaces = await Space.findAll({
      where: { location },
      attributes: ['id', 'name']
    });

    if (spaces.length === 0) {
      return res.status(404).json({ error: "Nenhum espaço encontrado para a localização informada." });
    }

    const spaceIds = spaces.map(space => space.id);

    // Buscar todas as reservas para a data e localização
    const reservas = await Booking.findAll({
      where: {
        date: date.trim(),
        space_id: spaceIds
      },
      attributes: ['space_id', 'turno']
    });

    // Verificar se há conflito de turnos
    const spaceIdsIndisponiveis = reservas
      .filter(reserva => {
        const turnoReserva = reserva.turno.toLowerCase();

        return (
          // Se a reserva for "integral", ela bloqueia qualquer turno
          turnoReserva === "integral" ||
          // Se a busca for por "integral", qualquer reserva existente já bloqueia
          turnoBusca === "integral" ||
          // Se forem turnos iguais, também bloqueia
          turnoReserva === turnoBusca
        );
      })
      .map(reserva => reserva.space_id);

    // Filtrar os espaços que ainda estão disponíveis
    const availableSpaces = spaces.filter(space => !spaceIdsIndisponiveis.includes(space.id));

    res.json({ availableSpaces });

  } catch (error) {
    console.error("Erro ao verificar disponibilidade:", error);
    res.status(500).json({ error: "Erro ao verificar disponibilidade." });
  }
};





