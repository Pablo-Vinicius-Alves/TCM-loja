import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { autenticar } from '../middlewares/authenticate.js';
import authRoutes from './authRoutes.js';
import clienteRoutes from './clienteRoutes.js';

 
const router = Router();

router.use(cookieParser());

router.use('/auth', authRoutes);        
 
router.use('/clientes', autenticar, clienteRoutes); 
 
export default router;