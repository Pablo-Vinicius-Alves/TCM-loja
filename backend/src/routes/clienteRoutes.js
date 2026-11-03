import { Router } from 'express';
import * as controller from '../controllers/clienteController.js';
import asyncHandler from '../middlewares/async.js';
 
const router = Router();
 
router.get('/', asyncHandler(controller.listarClientes));   
router.get('/:id', asyncHandler(controller.buscarCliente));     
router.post('/', asyncHandler(controller.criarCliente));        
router.put('/:id', asyncHandler(controller.atualizarCliente));  
router.delete('/:id', asyncHandler(controller.removerCliente)); 
 
export default router;