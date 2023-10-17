import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';
import { User } from './User.js';
import { Book } from './Book.js';

export const Rating = sequelize.define('rating', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
  },
  rating: {
    type: DataTypes.STRING,
    validate: { // like CHECH constraint but only by JS (don't added in DB)
      is: /^[12345]$/,
      //   others: not: RegExp, isEmail, isURL, isIP, isAlpha, isAlphanumeric,
      //   isNumeric, isInt, isFloat, isDecimal, isLowercase, isUppercase,,
      //   notNull, isNull, notEmpty, equals: value, contains: 'substring',
      //   notContains: 'substring', isIN: [['val1', 'val2']], notIn,
      //   isUUID: 4, isDate, isAfter: 'someData', isBefore, max: value, min
      // customValidate(value) {... throw new Error('message')}
      //   allowNull:true + value=NULL => only build in validators are missed
    },
  },
}, {
  tableName: 'ratings',
  underscored: true,
});

// 'Rating' model has 2 foreign keys: 'user_id' and 'book_id'
User.belongsToMany(Book, {
  through: Rating,
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false,
  },
  // onDelete: 'CASCADE', // default value for 'belongsToMany' associations
});

Book.belongsToMany(User, {
  through: Rating,
  foreignKey: {
    name: 'bookId',
    field: 'book_id',
    allowNull: false,
  },
});

// 'belongsToMany' automatically create unique constraint for 2 columns:
// UNIQUE (user_id, book_id)

// Allow do eager loading between User and Rating, Book and Rating
User.hasMany(Rating, { as: 'booksRating' }); // alias for nested 'include' prop.
Rating.belongsTo(User);
Book.hasMany(Rating);
Rating.belongsTo(Book);
