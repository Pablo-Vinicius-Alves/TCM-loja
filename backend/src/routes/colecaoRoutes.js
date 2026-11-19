import { Router } from 'express';
import * as controller from '../controllers/colecaoController.js';
import  asyncHandler from '../middlewares/async.js';

const router = Router();

router.get('/', asyncHandler(controller.listarColecoes)); 

export default router;