
import db from '../models/index.js';
const { Space ,  Booking} = db;

export const getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.findAll();
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSpace = async (req, res) => {
  try {
    const space = await Space.create(req.body);
    res.json(space);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSpace = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o espaço existe
    const space = await Space.findByPk(id);
    if (!space) {
      return res.status(404).json({ error: "Espaço não encontrado." });
    }

    // Verifica se há reservas vinculadas a esse espaço
    const reservasRelacionadas = await Booking.count({ where: { space_id: id } });
    if (reservasRelacionadas > 0) {
      return res.status(400).json({
        error: "Não é possível excluir este espaço porque há reservas associadas a ele."
      });
    }

    // Exclui o espaço
    await space.destroy();

    res.json({ message: "Espaço excluído com sucesso." });
  } catch (error) {
    console.error("❌ Erro ao excluir espaço:", error);
    res.status(500).json({ error: "Erro ao excluir espaço." });
  }
};
