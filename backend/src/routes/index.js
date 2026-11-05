import { Router } from 'express';
import clienteRoutes from './clienteRoutes.js';
import { autenticar } from '../middlewares/authenticate.js';
import cookieParser from 'cookie-parser';
import authRoutes from './authRoutes.js'

 
const router = Router();

router.use(cookieParser());

router.use('/auth', authRoutes)
 
router.use('/clientes', autenticar, clienteRoutes); 
 
export default router;