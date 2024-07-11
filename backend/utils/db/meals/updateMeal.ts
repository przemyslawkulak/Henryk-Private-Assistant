import { Meal } from '../../interfaces/meal';
import prisma from '../prisma';

export default async function mealUpdatePrisma(id: number, meal: Meal) {
  try {
    const meals = (await prisma.meal.update({
      where: { id },
      data: meal,
    })) as Meal;
    return meals;
  } catch (error) {
    return error;
  }
}



