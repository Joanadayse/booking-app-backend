import Space from "../models/space.model.js";

export const getAllSpaces = async (req, res) => {
  const spaces = await Space.findAll();
  res.json(spaces);
};

export const createSpace = async (req, res) => {
  const space = await Space.create(req.body);
  res.json(space);
};