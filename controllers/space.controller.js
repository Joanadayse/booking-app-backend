import Space from "../models/space.model.js";

export const getAllSpaces = async (req, res) => {
  const spaces = await Space.findAll();
  res.json(spaces);
};

export const createSpace = async (req, res) => {
//   const spaceExists = await Space.findByPk(space_id);
// if (!spaceExists) {
//   return res.status(400).json({ error: "Espaço não encontrado." });
// }

  const space = await Space.create(req.body);
  res.json(space);
};