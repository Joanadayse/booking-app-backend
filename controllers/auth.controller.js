import jwt from "jsonwebtoken";
import db from "../models/index.js"; 


const userModel = db.User;
const secret = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Nome e e-mail são obrigatórios." });
  }

  try {
    let user = await userModel.findOne({ where: { email } });

    if (!user) {
      user = await userModel.create({ name, email });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, secret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await userModel.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email']
    });

    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(user); // Repare que não precisa `{ user }`, pois já é só isso

  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

