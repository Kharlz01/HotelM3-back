import { Router } from "express";
import { 
    getUserById,
    getCurrentUserInfo,
    updateUser,
    changePassword,
    } from "../controller/users.controller.js";

const router = Router();

router.get('/userinfo', getCurrentUserInfo)

router.get('/:id',getUserById);

router.put('/settings/:id', updateUser);

router.put('/changePassword', changePassword)

export default router;