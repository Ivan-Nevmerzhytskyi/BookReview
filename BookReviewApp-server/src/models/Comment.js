import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';
import { User } from './User.js';
import { Book } from './Book.js';

export const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: User,
      key: 'id',
    },
  },
  bookId: {
    type: DataTypes.UUID,
    field: 'book_id',
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: Book,
      key: 'id',
    },
  },
}, {
  tableName: 'comments',
  underscored: true,
});

// 'Comment' model has 2 foreign keys that are described in the model itself
User.belongsToMany(Book, {
  through: {
    model: Comment,
    unique: false, // by default automatically create: UNIQUE(user_id, book_id)
  },
});
Book.belongsToMany(User, { through: { model: Comment, unique: false } });
