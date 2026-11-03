 import { Router } from 'express';
import clienteRoutes from './clienteRoutes.js';
 
const router = Router();
 
router.use('/clientes', clienteRoutes); 
 
export default router;