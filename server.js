import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import spaceRoutes from './routes/space.routes.js';
import db from './models/index.js'; 

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local',
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rota simples de teste
app.get('/', (req, res) => {
  res.send('API de Reservas funcionando! 🚀');
});

// Rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/spaces', spaceRoutes);

// Sincronização com o banco
db.sequelize.sync() // ⚠️ Em produção use `{ force: false }`
  .then(() => {
    console.log("🟢 Banco sincronizado");
    app.listen(port, () => {
      console.log(`✅ Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("🔴 Erro ao conectar ao banco:", err);
  });
