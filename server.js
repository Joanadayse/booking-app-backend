import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { db, sequelize } from './models/index.js'; // novo

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Teste de rota
app.get('/', (req, res) => {
  res.send('API de Reservas funcionando! 🚀');
});

// Rotas
app.use('/api/auth', authRoutes);

// Teste e sincronização com o banco
sequelize.sync({ alter: true }) // Cria/atualiza tabelas automaticamente
  .then(() => {
    console.log('🟢 Banco sincronizado com Sequelize');
    app.listen(port, () => {
      console.log(`✅ Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('🔴 Erro ao conectar ao banco de dados:', err);
  });
