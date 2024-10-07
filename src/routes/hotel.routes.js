import { Router, } from 'express';

import {
  getAllHotels,
  getHotelById,
} from '../controller/hotel.controller.js';

const router = Router();

router.get('/', getAllHotels);
router.get('/:id', getHotelById);

export default router;