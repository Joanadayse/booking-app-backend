// models/index.js
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

import userModel from "./user.model.js";
import spaceModel from "./space.model.js";
import bookingModel from "./booking.model.js";

dotenv.config();

// Conecta usando a DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

// Inicializa o objeto db
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, DataTypes);
db.Space = spaceModel(sequelize, DataTypes);
db.Booking = bookingModel(sequelize, DataTypes);

// Relacionamentos
db.User.hasMany(db.Booking, { foreignKey: "user_id" });
db.Booking.belongsTo(db.User, { foreignKey: "user_id" });

db.Space.hasMany(db.Booking, { foreignKey: "space_id" });
db.Booking.belongsTo(db.Space, { foreignKey: "space_id" });

export default db;
