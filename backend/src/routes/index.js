import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { autenticar } from '../middlewares/authenticate.js';
import authRoutes from './authRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import carrinhoRoutes from './carrinhoRoutes.js';

 
const router = Router();

router.use(cookieParser());

router.use('/auth', authRoutes);        
 
router.use('/clientes', autenticar, clienteRoutes); 

router.use('/carrinho', autenticar, carrinhoRoutes);
 
export default router;