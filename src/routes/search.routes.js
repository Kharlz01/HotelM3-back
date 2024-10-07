import { Router, } from 'express';

import { findAllHotelsBySearch, } from '../controller/search.controller.js';

const router = Router();

router.get('/', findAllHotelsBySearch);

export default router;