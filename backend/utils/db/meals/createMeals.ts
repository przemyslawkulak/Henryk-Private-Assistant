import { Meal } from '../../interfaces/meal';
import prisma from '../prisma';



export default async function mealsCreatePrisma(meal: Meal) {
  try {
    const createdMeal = await prisma.meal.create({
      data: meal,
    });
    return createdMeal;
  } catch (error) {
    return error;
  }
}
