import 'dotenv/config';

import http from 'http';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import './database/connection.js';

import admin from './middlewares/admin.middleware.js';
import { auth } from './middlewares/auth.middleware.js';

import searchRouter from './routes/search.routes.js'
import hotelRouter from './routes/hotel.routes.js'
import reservationRouter from './routes/reservation.routes.js'
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/users.routes.js';
import backofficeRouter from './routes/backoffice.routes.js';

async function main() {
    const port = process.env.APP_PORT ?? 4000;
    const app = express();

    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.json());

    app.get('/', (req,res) => {
        res.send('Hola mundo!');
    });

    // Ruta para usuario global
    app.use('/auth', authRouter);
    // Consultas generales
    app.use('/hotels', hotelRouter);
    app.use('/search', searchRouter);
    // Añadir middleware en el router
    app.use('/users', auth, userRouter);
    app.use('/reservations', auth, reservationRouter);
    // Configuraciones a nivel admin
    app.use('/backoffice', auth, admin, backofficeRouter);

    const httpServer = http.createServer(app);
    httpServer.listen(port, () => {
        console.log('Server running on port: ', port);   
    });
    // console.log('Puerto: ',process.env.APP_PORT);
}

main();