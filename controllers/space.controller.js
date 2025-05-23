import db from '../models/index.js';
const { Space } = db;

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
