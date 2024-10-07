import { Router, } from 'express';

import {
    getAllReservations,
    createReservation,
    updateReservation,
} from '../controller/reservation.controller.js'

const router = Router();

router.get('/', getAllReservations);

router.post('/', createReservation);

router.put('/:id', updateReservation);

export default router;