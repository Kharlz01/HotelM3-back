import { Sequelize } from "sequelize";

//  Se pone + para volver num

const connection = new Sequelize ({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});

try {
    connection
    .authenticate()
    .then(() => console.log('Conectado a la base de datos'));
}catch(err){
    console.error(err);
}

export {connection, };