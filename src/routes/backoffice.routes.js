import { Router, } from 'express';

import {
  createHotel,
  updateHotel,
  deleteHotel,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controller/backoffice.controller.js';

const router = Router();

// Crear hoteles
router.post('/hotels', createHotel);

// Actualizar hoteles
router.put('/hotels/:id', updateHotel);

// Eliminar hoteles
router.delete('/hotels/:id', deleteHotel);

// Crear habitaciones
router.post('/rooms', createRoom);

// Actualizar habitaciones
router.put('/rooms/:codeName', updateRoom);

// Eliminar habitaciones
router.delete('/rooms/:codeName', deleteRoom);

export default router;