import { Router } from "express";
import { 
    getUserById,
    getCurrentUserInfo,
    updateUser,
    } from "../controller/users.controller.js";

const router = Router();

router.get('/userinfo', getCurrentUserInfo)

router.get('/:id',getUserById);

router.put('/settings/:id', updateUser);

export default router;