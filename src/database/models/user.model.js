import { v4,} from 'uuid';
import { DataTypes } from "sequelize";

import { connection } from '../connection.js';

const User = connection.define(
    'users',
    {
        id: {
            type: DataTypes.STRING(36),
            primaryKey : true,
        },
        email: {
            type: DataTypes.STRING,
            unique : true,
        },
        password: DataTypes.STRING,
        givenName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        phoneNumber: {
            type: DataTypes.STRING(15),
            unique: true,
            allowNull: true,
        },
        address: DataTypes.STRING,
        // TODO: agregar opcion de administrador.
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: true, //createdAt, updatedAt
    }
);

export { 
    User, 
};