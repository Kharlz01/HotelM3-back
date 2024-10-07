import { v4 } from 'uuid';
import { DataTypes, } from 'sequelize';

import { connection } from '../connection.js';

const Room = connection.define(
  'rooms',
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
    },
    photos: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codeName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pricePerNight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bedsQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export {
    Room
};