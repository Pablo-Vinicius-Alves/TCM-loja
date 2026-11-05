import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import asyncHandler from '../middlewares/async.js';
import { autenticar } from '../middlewares/authenticate.js';
 
const router = Router();
 
router.post('/registrar', asyncHandler(controller.registrar)); 
router.post('/login', asyncHandler(controller.login));       
router.post('/logout', asyncHandler(controller.logout));       
router.get('/perfil', autenticar, asyncHandler(controller.perfil)); 
 
export default router;