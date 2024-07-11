import { Router } from 'express';
import { getGrocyData } from '../controllers/grocyControllers/grocyController';

const router = Router();

router.get('/', getGrocyData);

export default router;
