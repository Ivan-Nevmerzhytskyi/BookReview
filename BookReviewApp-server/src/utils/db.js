/* eslint-disable no-console */
// #region Connect to PostgreSQL by Sequelize
import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  },
);

try {
  await sequelize.authenticate(); // Testing the connection(not required)
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
// #endregion

// #region Connect to PostgreSQL by node-postgres
// import 'dotenv/config';
// import pkg from 'pg'; // node-postgres

// const { Client } = pkg;

// export const client = new Client({
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE,
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
// });

// try {
//   await client.connect();
// } catch (error) {
//   console.error('Can`t connect to DB:\n', error);
// }
// #endregion
