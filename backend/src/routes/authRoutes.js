import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { asyncHandler } from '../middlewares/async.js';
import { autenticar } from '../middlewares/autenticar.js';
 
const router = Router();
 
router.post('/registrar', asyncHandler(controller.registrar)); 
router.post('/login', asyncHandler(controller.login));       
router.post('/logout', asyncHandler(controller.logout));       
router.get('/me', autenticar, asyncHandler(controller.perfil)); 
 
export default router;