import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dailyGoals: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'users',
});

// Instance helper to verify password
User.prototype.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Class helper to create a user with hashed password
User.createWithPassword = async function (email, password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return this.create({ email, passwordHash: hash });
};

export default User;
