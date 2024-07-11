import { Router } from 'express';
import * as mealsController from '../controllers/mealsControllers/mealsController' //'../controllers/mealsController';

const router = Router();

router.post('/', mealsController.createMeal);
router.get('/', mealsController.getAllMeals);
router.get('/:id', mealsController.getMealById);
router.put('/:id', mealsController.updateMeal);
router.delete('/:id', mealsController.deleteMeal);
router.get('/read-csv', mealsController.readCSV);

export default router;
