import { DataTypes } from 'sequelize';
import { client } from '../utils/db.js';
import { User } from './User.js';

export const Book = client.define(
  'book',
  {
    // id: { // default add by Sequelize
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    //   unique: true,
    // },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // default: 'NULL'
      // defaultValue: sequelize.fn('gen_random_uuid'), // add dV generate in DB
      unique: true,
      // get() {
      //   const rawValue = this.getDataValue('id'); // data from DB
      //   return ...; // handle 'rawValue' and return new data
      // },
      // set(value) {
      //   this.otherColumn // data from other column in table
      //   this.setDataValue('id', newData); // handle 'value' and save it to DB
      // },
      // type: DataTypes.VIRTUAL, // virtual column that is not stored in the DB
    },
    coverSrc: {
      type: DataTypes.JSON,
      allowNull: false, // default: 'true'
      field: 'cover_src', // custom column name for 'cover_src' column in DB
    },
    title: {
      type: DataTypes.STRING, // VARCHAR(255)
      // type: DataTypes.STRING(1234), // VARCHAR(1234)
      // type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // composite unique constraint for 2 columns:
    // uniqueOne: { type: DataTypes.STRING, unique: 'compositeIndex' },
    // uniqueTwo: { type: DataTypes.INTEGER, unique: 'compositeIndex' },
    // createdAt: { // default add by Sequelize
    //   type: DataTypes.DATE,
    //   field: 'created_at',
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW,
    // },
    // updatedAt: { // default add by Sequelize
    //   type: DataTypes.DATE,
    //   field: 'created_at',
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW,
    // },
    // user_id: { // create foreign keys
    //   type: DataTypes.UUID,
    //   references: {
    //     model: User, // This is a reference to another model
    //     key: 'id', // This is the column name of the referenced model
    //   },
    //   allowNull: false,
    //   onDelete: 'CASCADE',
    // },
  },
  {
    tableName: 'books', // default: pluralizes the model name (books)
    underscored: true, // converts all camelCased columns to underscored in DB
    // freezeTableName: true, // table name === model name(book)
    // updatedAt: false, // disable only 'updatedAt' behavior
    // timestamps: false, // disabled 'createdAt' and 'updatedAt' behavior
  },
);

Book.belongsTo(User, {
  foreignKey: {
    // <=> foreignKey: 'user_id'
    name: 'userId', // default: userId
    field: 'user_id',
    allowNull: false, // default: true
    // defaultValue: 'someValue',
  },
  onDelete: 'CASCADE', // SET NULL(default), RESTRICT, NO ACTION, SET DEFAULT
  // onUpdate: 'CASCADE', // default value
});

// User.hasOne(Book); // Create one foreign key in Book belong to User
// Few foreign keys in Book model can belong to User model:
User.hasMany(Book);
