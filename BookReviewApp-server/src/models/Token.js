import { DataTypes } from 'sequelize';
import { client } from '../utils/db.js';
import { User } from './User.js';

export const Token = client.define(
  'token',
  {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'tokens',
    underscored: true,
  },
);

Token.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

User.hasOne(Token);
