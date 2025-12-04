import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Meal = sequelize.define('Meal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  foodId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  foodName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  servingSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  servingUnit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'g',
  },
  servings: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
  nutrition: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isPlanned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'meals',
});

export default Meal;