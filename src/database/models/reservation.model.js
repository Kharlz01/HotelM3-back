import { v4 } from "uuid";
import { DataTypes } from "sequelize";

import { connection } from "../connection.js";

const Reservation = connection.define(
    'reservations',
    {
      id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'cancel'), // ACTIVO, INACTIVO O CANCELADO.
        allowNull: false,
        defaultValue: 'active',
      },
      nightsQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );
  
  export {
    Reservation,
};