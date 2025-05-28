export const login = (req, res) => {
  const { name, email } = req.body;

  // Exemplo temporário (simulação)
  if (name === "Joana" && email === "joana@email.com") {
    return res.status(200).json({ message: "Login realizado com sucesso!" });
  }

  return res.status(401).json({ message: "Credenciais inválidas" });
};

