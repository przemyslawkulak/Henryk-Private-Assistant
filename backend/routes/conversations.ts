import { Router } from 'express';
import { getConversationsData } from '../controllers/conversationsController/conversationsController';

const router = Router();

router.get('/:take', getConversationsData);

export default router;
