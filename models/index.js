// models/index.js
import { Sequelize, DataTypes } from "sequelize";
import { readFileSync } from "fs";

// Lê configurações do config.json
const rawConfig = readFileSync(new URL("../config/config.json", import.meta.url));
const parsedConfig = JSON.parse(rawConfig);
const dbConfig = parsedConfig.development;

// Conecta com o banco
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

// Importa modelos
import userModel from "./user.model.js";
import spaceModel from "./space.model.js";
import bookingModel from "./booking.model.js";

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
