import { Router, } from 'express';

import {
    createLogin,
    createSignup,
} from '../controller/auth.controller.js'

const router = Router();

router.post('/login', createLogin);

router.post('/signup', createSignup);

export default router;