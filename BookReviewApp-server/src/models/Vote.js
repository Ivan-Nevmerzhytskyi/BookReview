import { DataTypes } from 'sequelize';
import { client } from '../utils/db.js';
import { User } from './User.js';
import { Comment } from './Comment.js';

export const Vote = client.define(
  'vote',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    vote: {
      type: DataTypes.STRING,
      validate: {
        // like CHECH constraint but only by JS (don't added in DB)
        isIn: [['like', 'dislike']],
      },
    },
  },
  {
    tableName: 'votes',
    underscored: true,
  },
);

// 'Rating' model has 2 foreign keys: 'user_id' and 'comment_id'
User.belongsToMany(Comment, {
  through: Vote,
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false,
  },
});

Comment.belongsToMany(User, {
  through: Vote,
  foreignKey: {
    name: 'commentId',
    field: 'comment_id',
    allowNull: false,
  },
});

// 'belongsToMany' automatically create unique constraint for 2 columns:
// UNIQUE (user_id, comment_id)

// Allow do eager loading between User and Vote, Comment and Vote
User.hasMany(Vote, { as: 'commentsVote' }); // alias for nested 'include' prop.
Vote.belongsTo(User);
Comment.hasMany(Vote);
Vote.belongsTo(Comment);
