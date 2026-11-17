import { Router } from 'express';
import * as ProdutoController from '../controllers/produtoController.js';
import asyncHandler from '../middlewares/async.js'; 

const router = Router();

router.get('/', asyncHandler(ProdutoController.listar));

export default router;