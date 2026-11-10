import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { autenticar } from '../middlewares/authenticate.js';
import authRoutes from './authRoutes.js';
import clienteRoutes from './clienteRoutes.js';
import produtoRoutes from './produtoRoutes.js';
import colecaoRoutes from './colecaoRoutes.js';

 
const router = Router();

router.use(cookieParser());

router.use('/auth', authRoutes);

router.use('/produtos', produtoRoutes);       
router.use('/colecoes', colecaoRoutes);        
 
router.use('/clientes', autenticar, clienteRoutes); 
 
export default router;