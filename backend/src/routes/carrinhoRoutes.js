import { Router } from 'express';
import * as controller from '../controllers/carrinhoController.js';
import asyncHandler  from '../middlewares/async.js';

const router = Router();

router.get('/', asyncHandler(controller.obter));               
router.get('/pedidos', asyncHandler(controller.listarPedidos));                    
router.post('/itens', asyncHandler(controller.adicionar));                          
router.patch('/itens/:idProduto', asyncHandler(controller.alterarQuantidade));      
router.delete('/itens/:idProduto', asyncHandler(controller.removerItem));           
router.delete('/', asyncHandler(controller.esvaziar));    
router.post('/finalizar', asyncHandler(controller.finalizar));
router.get('/nota-fiscal/:idNotaFiscal', asyncHandler(controller.obterNotaFiscal));     
router.post('/cupom', asyncHandler(controller.validarCupom));                     

export default router;