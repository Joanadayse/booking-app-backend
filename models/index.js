// models/index.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import {User} from './user.model.js';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

export const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User(sequelize, DataTypes);

export default db;
